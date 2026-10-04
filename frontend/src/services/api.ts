import {
  ProfileContent, SkillItem, ProjectItem, BlogItem, ExperienceItem, TestimonialItem,
  ServiceItem, ContactMessage, MediaAsset, AdminUser,
} from '../types/cms';

// ---------------------------------------------------------------------------
// Real REST client for the Spring Boot backend.
// Design: components still read data synchronously (cmsApi.getProjects() ...) from an
// in-memory cache that is loaded from the API at startup. Writes update the cache
// immediately (optimistic) and are sent to the server in order; if one fails we show an
// error and reload from the server.
// ---------------------------------------------------------------------------

const API_BASE = ((import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:8080/api').replace(/\/$/, '');
const ORIGIN = new URL(API_BASE, window.location.origin).origin;

const KEYS = { ACCESS: 'apex_cms_access_token', REFRESH: 'apex_cms_refresh_token', USER: 'apex_cms_user' };
const LEGACY_KEYS = [
  'apex_cms_profile', 'apex_cms_projects', 'apex_cms_skills', 'apex_cms_experiences', 'apex_cms_blogs',
  'apex_cms_testimonials', 'apex_cms_services', 'apex_cms_messages', 'apex_cms_media',
  'apex_cms_jwt_token', 'apex_cms_auth_user', 'apex_cms_api_logs',
];

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

type Kind = 'projects' | 'skills' | 'experiences' | 'blogs' | 'testimonials' | 'services';
const PATHS: Record<Kind, string> = {
  projects: '/projects', skills: '/skills', experiences: '/experience',
  blogs: '/blogs', testimonials: '/testimonials', services: '/services',
};

const BLANK_PROFILE: ProfileContent = {
  id: '1', name: '', roleTitle: '', heroKicker: '', tagline: '', bio: '', extendedBio: '', location: '',
  email: '', githubUrl: '', linkedinUrl: '', resumeUrl: '', avatarUrl: '', availability: 'Available for hire',
  stats: { yearsExperience: 0, shippedProjects: 0, githubContributions: 0, clientSatisfactionRate: 0 },
};

// Uploaded files are stored as relative paths ("/uploads/x.png") in the database.
// In the browser we show them as absolute URLs so <img> works from any frontend origin.
const toAbs = <T,>(v: T): T => JSON.parse(JSON.stringify(v), (_k, x) =>
  typeof x === 'string' && x.startsWith('/uploads/') ? ORIGIN + x : x);
const toRel = <T,>(v: T): T => JSON.parse(JSON.stringify(v), (_k, x) =>
  typeof x === 'string' && x.startsWith(ORIGIN + '/uploads/') ? x.slice(ORIGIN.length) : x);

const withStringId = <T extends { id?: unknown }>(o: T): T & { id: string } => ({ ...o, id: String(o.id) });
const formatSize = (bytes: number) => bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(bytes / 1024)) + ' KB';
const isTemp = (id: string) => id.startsWith('tmp-');

function jwtExpiresInSeconds(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp - Date.now() / 1000;
  } catch { return -1; }
}

class CmsApiService {
  private listeners = new Set<() => void>();
  private errorListeners = new Set<(msg: string) => void>();
  private queue: Promise<unknown> = Promise.resolve();
  private tempToReal = new Map<string, string>();
  private refreshing: Promise<boolean> | null = null;

  private data = {
    profile: BLANK_PROFILE,
    projects: [] as ProjectItem[], skills: [] as SkillItem[], experiences: [] as ExperienceItem[],
    blogs: [] as BlogItem[], testimonials: [] as TestimonialItem[], services: [] as ServiceItem[],
    messages: [] as ContactMessage[], media: [] as MediaAsset[],
  };

  // ---------- subscriptions ----------
  public subscribe(l: () => void) { this.listeners.add(l); return () => { this.listeners.delete(l); }; }
  public subscribeErrors(l: (msg: string) => void) { this.errorListeners.add(l); return () => { this.errorListeners.delete(l); }; }
  private notify() { this.listeners.forEach(l => l()); }
  private emitError(msg: string) { this.errorListeners.forEach(l => l(msg)); }

  // ---------- low-level HTTP ----------
  private async request<T = any>(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: string, body?: unknown, retried = false): Promise<T> {
    // Login/refresh/setup are called without a token; every other path (including /auth/account) sends it.
    const isAuthPath = ['/auth/login', '/auth/refresh', '/auth/setup', '/auth/setup-status'].includes(path);
    if (!isAuthPath) await this.ensureFreshToken();
    const isForm = body instanceof FormData;
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';
    const token = this.getJwtToken();
    if (token && !isAuthPath) headers.Authorization = `Bearer ${token}`;

    let res: Response;
    try {
      res = await fetch(API_BASE + path, {
        method, headers,
        body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(toRel(body)),
      });
    } catch {
      throw new ApiError(0, `Cannot reach the API at ${API_BASE}. Is the backend running?`);
    }

    if (res.status === 401 && !isAuthPath && !retried && this.getRefreshToken() && await this.tryRefresh()) {
      return this.request<T>(method, path, body, true);
    }

    const text = res.status === 204 ? '' : await res.text();
    let payload: any;
    try { payload = text ? JSON.parse(text) : undefined; } catch { payload = undefined; }
    if (!res.ok) {
      const detail = payload?.errors ? Object.values(payload.errors).join(', ') : payload?.detail;
      throw new ApiError(res.status, detail || (res.status === 401 ? 'Please log in again' : `Request failed (${res.status})`));
    }
    return (payload === undefined ? undefined : toAbs(payload)) as T;
  }

  private async ensureFreshToken() {
    const t = this.getJwtToken();
    if (t && this.getRefreshToken() && jwtExpiresInSeconds(t) < 30) await this.tryRefresh();
  }

  private tryRefresh(): Promise<boolean> {
    if (!this.refreshing) {
      this.refreshing = (async () => {
        try {
          const r = await this.request<any>('POST', '/auth/refresh', { refreshToken: this.getRefreshToken() });
          this.storeSession(r);
          return true;
        } catch {
          this.clearSession();
          this.notify();
          return false;
        } finally { this.refreshing = null; }
      })();
    }
    return this.refreshing;
  }

  // ---------- auth ----------
  private storeSession(r: { accessToken: string; refreshToken: string; user: any }) {
    localStorage.setItem(KEYS.ACCESS, r.accessToken);
    localStorage.setItem(KEYS.REFRESH, r.refreshToken);
    const user: AdminUser = { id: String(r.user.id), email: r.user.email, name: r.user.name, role: r.user.role, token: r.accessToken };
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  }
  private clearSession() { Object.values(KEYS).forEach(k => localStorage.removeItem(k)); }
  public getJwtToken(): string | null { return localStorage.getItem(KEYS.ACCESS); }
  private getRefreshToken(): string | null { return localStorage.getItem(KEYS.REFRESH); }
  public getAuthUser(): AdminUser | null {
    if (!this.getJwtToken()) return null;
    try { return JSON.parse(localStorage.getItem(KEYS.USER) || 'null'); } catch { return null; }
  }

  public async getSetupStatus(): Promise<boolean> {
    try { return (await this.request<{ setupRequired: boolean }>('GET', '/auth/setup-status')).setupRequired; }
    catch { return false; }
  }

  public async login(email: string, pass: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    try {
      this.storeSession(await this.request('POST', '/auth/login', { email, password: pass }));
      await this.reload();
      return { success: true, user: this.getAuthUser() ?? undefined };
    } catch (e) {
      return { success: false, error: e instanceof ApiError ? e.message : 'Login failed' };
    }
  }

  /** First-run only: creates the very first admin (the backend rejects it once any user exists). */
  public async setupAdmin(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.storeSession(await this.request('POST', '/auth/setup', { name, email, password }));
      await this.reload();
      return { success: true };
    } catch (e) {
      return { success: false, error: e instanceof ApiError ? e.message : 'Setup failed' };
    }
  }

  /** Change name / email / password of the logged-in admin. The current password is required. */
  public async updateAccount(data: { currentPassword: string; name?: string; email?: string; newPassword?: string }): Promise<{ success: boolean; error?: string }> {
    try {
      this.storeSession(await this.request('PUT', '/auth/account', data));
      this.notify();
      return { success: true };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Could not update account' };
    }
  }

  public logout() {
    this.clearSession();
    this.data.messages = []; this.data.media = [];
    this.notify();
    void this.reload().catch(() => undefined); // drafts disappear, only published content remains
  }

  /** Forces a token refresh. Returns the token currently stored. */
  public refreshAuthToken(): string {
    void this.tryRefresh();
    return this.getJwtToken() ?? '';
  }

  // ---------- loading ----------
  public async init(): Promise<void> {
    LEGACY_KEYS.forEach(k => localStorage.removeItem(k)); // old fake localStorage data
    await this.reload();
  }

  public async reload(): Promise<void> {
    const get = <T,>(path: string, fallback: T) => this.request<T>('GET', path).catch((e: ApiError) => {
      if (e.status === 0) throw e;
      return fallback;
    });
    const authed = !!this.getJwtToken();
    const [profile, projects, skills, experiences, blogs, testimonials, services, messages, media] = await Promise.all([
      get<any>('/about', null),
      get<any[]>(PATHS.projects, []), get<any[]>(PATHS.skills, []), get<any[]>(PATHS.experiences, []),
      get<any[]>(PATHS.blogs, []), get<any[]>(PATHS.testimonials, []), get<any[]>(PATHS.services, []),
      authed ? get<any[]>('/messages', []) : Promise.resolve([]),
      authed ? get<any[]>('/media', []) : Promise.resolve([]),
    ]);
    if (authed && !this.getJwtToken()) return this.reload(); // token expired during load: retry as public
    this.data.profile = profile ? withStringId({ ...BLANK_PROFILE, ...profile, stats: { ...BLANK_PROFILE.stats, ...profile.stats } }) : BLANK_PROFILE;
    this.data.projects = projects.map(withStringId);
    this.data.skills = skills.map(withStringId);
    this.data.experiences = experiences.map(withStringId);
    this.data.blogs = blogs.map(withStringId);
    this.data.testimonials = testimonials.map(withStringId);
    this.data.services = services.map(withStringId);
    this.data.messages = messages.map(withStringId);
    this.data.media = media.map(m => this.toMedia(m));
    this.notify();
  }

  // ---------- optimistic writes ----------
  private enqueue(task: () => Promise<void>, failMsg: string) {
    this.queue = this.queue.then(task).catch(async (e: unknown) => {
      this.emitError(`${failMsg}: ${e instanceof Error ? e.message : 'unknown error'}`);
      await this.reload().catch(() => undefined);
    });
  }
  private realId(id: string) { return this.tempToReal.get(id) ?? id; }

  private visible<T extends { status: string; displayOrder: number }>(list: T[], includeDrafts: boolean): T[] {
    return [...list].filter(i => includeDrafts || i.status === 'published').sort((a, b) => a.displayOrder - b.displayOrder);
  }

  private saveItem<T extends { id: string; displayOrder: number }>(kind: Kind, item: Omit<T, 'id'> & { id?: string }): T {
    const list = this.data[kind] as unknown as T[];
    const localId = item.id || `tmp-${crypto.randomUUID()}`;
    const local = { ...item, id: localId, displayOrder: item.displayOrder ?? list.length + 1 } as T;
    const idx = list.findIndex(i => i.id === localId);
    if (idx >= 0) list[idx] = local; else list.push(local);
    this.notify();

    this.enqueue(async () => {
      const id = this.realId(localId);
      const creating = isTemp(id);
      const current = (this.data[kind] as unknown as T[]).find(i => i.id === localId || i.id === id) ?? local;
      const body = { ...current, id: creating ? undefined : Number(id) };
      const saved = withStringId(await this.request<any>(creating ? 'POST' : 'PUT', creating ? PATHS[kind] : `${PATHS[kind]}/${id}`, body));
      if (creating) this.tempToReal.set(localId, saved.id);
      const arr = this.data[kind] as unknown as T[];
      const at = arr.findIndex(i => i.id === localId || i.id === id);
      if (at >= 0) arr[at] = saved as unknown as T;
      this.notify();
    }, 'Could not save');
    return local;
  }

  private deleteItem(kind: Kind, id: string): boolean {
    const arr = this.data[kind] as unknown as { id: string }[];
    (this.data as any)[kind] = arr.filter(i => i.id !== id);
    this.notify();
    this.enqueue(async () => {
      const real = this.realId(id);
      if (!isTemp(real)) await this.request('DELETE', `${PATHS[kind]}/${real}`);
    }, 'Could not delete');
    return true;
  }

  // ---------- content types ----------
  public getProfile(): ProfileContent { return this.data.profile; }
  public updateProfile(updated: Partial<ProfileContent>): ProfileContent {
    const cur = this.data.profile;
    const next = { ...cur, ...updated, id: cur.id, stats: { ...cur.stats, ...(updated.stats || {}) } };
    this.data.profile = next;
    this.notify();
    this.enqueue(async () => {
      this.data.profile = withStringId(await this.request<any>('PUT', '/about', { ...next, id: 1 }));
      this.notify();
    }, 'Could not save profile');
    return next;
  }

  public getProjects(includeDrafts = false): ProjectItem[] { return this.visible(this.data.projects, includeDrafts); }
  public saveProject(item: Omit<ProjectItem, 'id'> & { id?: string }): ProjectItem { return this.saveItem<ProjectItem>('projects', item); }
  public deleteProject(id: string) { return this.deleteItem('projects', id); }

  public getSkills(includeDrafts = false): SkillItem[] { return this.visible(this.data.skills, includeDrafts); }
  public saveSkill(item: Omit<SkillItem, 'id'> & { id?: string }): SkillItem { return this.saveItem<SkillItem>('skills', item); }
  public deleteSkill(id: string) { return this.deleteItem('skills', id); }

  public getBlogs(includeDrafts = false): BlogItem[] { return this.visible(this.data.blogs as any[], includeDrafts) as BlogItem[]; }
  public saveBlog(item: Omit<BlogItem, 'id'> & { id?: string }): BlogItem { return this.saveItem<any>('blogs', item as any); }
  public deleteBlog(id: string) { return this.deleteItem('blogs', id); }

  public getExperiences(includeDrafts = false): ExperienceItem[] { return this.visible(this.data.experiences, includeDrafts); }
  public saveExperience(item: Omit<ExperienceItem, 'id'> & { id?: string }): ExperienceItem { return this.saveItem<ExperienceItem>('experiences', item); }
  public deleteExperience(id: string) { return this.deleteItem('experiences', id); }

  public getTestimonials(includeDrafts = false): TestimonialItem[] { return this.visible(this.data.testimonials, includeDrafts); }
  public saveTestimonial(item: Omit<TestimonialItem, 'id'> & { id?: string }): TestimonialItem { return this.saveItem<TestimonialItem>('testimonials', item); }
  public deleteTestimonial(id: string) { return this.deleteItem('testimonials', id); }

  public getServices(includeDrafts = false): ServiceItem[] { return this.visible(this.data.services, includeDrafts); }
  public saveService(item: Omit<ServiceItem, 'id'> & { id?: string }): ServiceItem { return this.saveItem<ServiceItem>('services', item); }
  public deleteService(id: string) { return this.deleteItem('services', id); }

  // ---------- messages ----------
  public getMessages(): ContactMessage[] { return this.data.messages; }

  public async submitContactForm(data: { name: string; email: string; subject: string; message: string }): Promise<{ success: boolean; id: string; error?: string }> {
    try {
      await this.request('POST', '/contact', data);
      return { success: true, id: 'received' };
    } catch (e) {
      return { success: false, id: '', error: e instanceof Error ? e.message : 'Failed to send' };
    }
  }

  public markMessageRead(id: string, isRead = true): void {
    const m = this.data.messages.find(x => x.id === id);
    if (m) m.isRead = isRead;
    this.notify();
    this.enqueue(async () => { await this.request('PATCH', `/messages/${id}/read?value=${isRead}`); }, 'Could not update message');
  }

  public deleteMessage(id: string): boolean {
    this.data.messages = this.data.messages.filter(m => m.id !== id);
    this.notify();
    this.enqueue(async () => { await this.request('DELETE', `/messages/${id}`); }, 'Could not delete message');
    return true;
  }

  // ---------- media ----------
  private toMedia(m: any): MediaAsset {
    return { id: String(m.id), name: m.originalName || m.fileName, url: m.url, size: formatSize(m.size), mimeType: m.mimeType, uploadedAt: m.uploadedAt, aspectRatio: '' };
  }
  public getMedia(): MediaAsset[] { return this.data.media; }

  public async uploadImage(file: File): Promise<MediaAsset> {
    const form = new FormData();
    form.append('file', file);
    const asset = this.toMedia(await this.request<any>('POST', '/upload/image', form));
    this.data.media = [asset, ...this.data.media];
    this.notify();
    return asset;
  }

  public deleteMedia(id: string): boolean {
    this.data.media = this.data.media.filter(m => m.id !== id);
    this.notify();
    this.enqueue(async () => { await this.request('DELETE', `/media/${id}`); }, 'Could not delete file');
    return true;
  }
}

export const cmsApi = new CmsApiService();
