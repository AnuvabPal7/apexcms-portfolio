import { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/common/Toast';
import { Navbar, AppViewMode } from './components/Navbar';
import { HeroSection } from './components/portfolio/HeroSection';
import { AboutSection } from './components/portfolio/AboutSection';
import { ProjectsSection } from './components/portfolio/ProjectsSection';
import { SkillsSection } from './components/portfolio/SkillsSection';
import { ExperienceSection } from './components/portfolio/ExperienceSection';
import { ServicesSection } from './components/portfolio/ServicesSection';
import { TestimonialsSection } from './components/portfolio/TestimonialsSection';
import { BlogSection } from './components/portfolio/BlogSection';
import { ContactSection } from './components/portfolio/ContactSection';
import { Footer } from './components/portfolio/Footer';
import { ProjectModal } from './components/portfolio/ProjectModal';
import { BlogModal } from './components/portfolio/BlogModal';
import { CmsLayout } from './components/cms/CmsLayout';
import { cmsApi } from './services/api';
import { ProjectItem, BlogItem, ProfileContent } from './types/cms';

/** Shows API write failures (from the optimistic update queue) as toasts. */
function ApiErrorBridge() {
  const { showToast } = useToast();
  useEffect(() => cmsApi.subscribeErrors((m) => showToast(m, 'error')), [showToast]);
  return null;
}

export default function App() {
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const [currentMode, setCurrentMode] = useState<AppViewMode>(window.location.hash === '#admin' ? 'cms' : 'portfolio');
  const [authed, setAuthed] = useState(!!cmsApi.getAuthUser());
  const [profile, setProfile] = useState<ProfileContent>(cmsApi.getProfile());
  const [projects, setProjects] = useState<ProjectItem[]>(cmsApi.getProjects(false));
  const [skills, setSkills] = useState(cmsApi.getSkills(false));
  const [experiences, setExperiences] = useState(cmsApi.getExperiences(false));
  const [services, setServices] = useState(cmsApi.getServices(false));
  const [testimonials, setTestimonials] = useState(cmsApi.getTestimonials(false));
  const [blogs, setBlogs] = useState<BlogItem[]>(cmsApi.getBlogs(false));

  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);
  const [activeBlogModal, setActiveBlogModal] = useState<BlogItem | null>(null);

  useEffect(() => {
    setLoadState('loading');
    cmsApi.init()
      .then(() => setLoadState('ready'))
      .catch((e: Error) => { setLoadError(e.message); setLoadState('error'); });
  }, [attempt]);

  useEffect(() => {
    const unsub = cmsApi.subscribe(() => {
      setAuthed(!!cmsApi.getAuthUser());
      setProfile(cmsApi.getProfile());
      setProjects(cmsApi.getProjects(false));
      setSkills(cmsApi.getSkills(false));
      setExperiences(cmsApi.getExperiences(false));
      setServices(cmsApi.getServices(false));
      setTestimonials(cmsApi.getTestimonials(false));
      setBlogs(cmsApi.getBlogs(false));
    });
    return unsub;
  }, []);

  // Typing #admin in the address bar opens the CMS even without reloading the page.
  useEffect(() => {
    const onHash = () => { if (window.location.hash === '#admin') setCurrentMode('cms'); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.title = profile.name ? `${profile.name} | Portfolio` : 'Portfolio';
  }, [profile.name]);

  if (loadState !== 'ready') {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6 text-center">
        {loadState === 'loading' ? (
          <p className="text-neutral-400">Loading content...</p>
        ) : (
          <div className="max-w-md space-y-4">
            <h1 className="text-xl font-bold">Can't reach the API</h1>
            <p className="text-sm text-neutral-400">{loadError}</p>
            <button onClick={() => setAttempt(a => a + 1)} className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 text-sm font-semibold">
              Retry
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <ToastProvider>
      <ApiErrorBridge />
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-400 selection:text-neutral-950">
        
        {/* Strict Top Bar Contract Header */}
        <Navbar
          currentMode={currentMode}
          onSelectMode={setCurrentMode}
          brandName={profile.name}
          showSwitcher={authed || currentMode === 'cms'}
        />

        {/* View Switcher */}
        {currentMode === 'portfolio' && (
          <main className="flex-1">
            <HeroSection profile={profile} />
            <AboutSection profile={profile} />
            <ProjectsSection
              projects={projects}
              onSelectProject={setActiveProjectModal}
            />
            <SkillsSection skills={skills} />
            <ExperienceSection experiences={experiences} />
            <ServicesSection services={services} />
            <TestimonialsSection testimonials={testimonials} />
            <BlogSection
              blogs={blogs}
              onSelectBlog={setActiveBlogModal}
            />
            <ContactSection profile={profile} />
            <Footer
              profile={profile}
              onOpenCms={() => setCurrentMode('cms')}
            />
          </main>
        )}

        {currentMode === 'cms' && (
          <div className="flex-1">
            <CmsLayout onViewPublicSite={() => setCurrentMode('portfolio')} />
          </div>
        )}

        {/* Modals */}
        <ProjectModal
          project={activeProjectModal}
          onClose={() => setActiveProjectModal(null)}
        />
        <BlogModal
          blog={activeBlogModal}
          onClose={() => setActiveBlogModal(null)}
        />

      </div>
    </ToastProvider>
  );
}
