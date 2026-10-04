export type ContentStatus = 'draft' | 'published';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR';
  avatarUrl?: string;
  token?: string;
}

export interface ProfileContent {
  id: string;
  name: string;
  roleTitle: string;
  heroKicker: string;
  tagline: string;
  bio: string;
  extendedBio: string;
  location: string;
  email: string;
  phone?: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string;
  resumeUrl: string;
  avatarUrl: string;
  availability: 'Available for hire' | 'Open to consulting' | 'Booked until Q3';
  stats: {
    yearsExperience: number;
    shippedProjects: number;
    githubContributions: number;
    clientSatisfactionRate: number;
  };
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend & Cloud' | 'Database & Architecture' | 'DevOps & Tooling';
  proficiency: number; // 0 to 100
  years: number;
  highlight?: boolean;
  displayOrder: number;
  status: ContentStatus;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  image: string;
  githubUrl: string;
  liveUrl: string;
  technologies: string[];
  featured: boolean;
  displayOrder: number;
  status: ContentStatus;
  category: 'Full-Stack' | 'SaaS & Enterprise' | 'Developer Tool' | 'AI Integration';
  outcomeMetric?: string;
  architectureDetails?: string[];
  completedYear: string;
}

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown / prose
  coverImage?: string;
  author: string;
  readTime: string;
  tags: string[];
  publishedAt: string;
  status: ContentStatus;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  period: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Founding';
  summary: string;
  achievements: string[];
  technologies: string[];
  displayOrder: number;
  status: ContentStatus;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  role: string;
  company: string;
  avatarUrl?: string;
  quote: string;
  projectWorkedOn: string;
  outcomeMetric?: string;
  rating: number; // 1-5
  displayOrder: number;
  status: ContentStatus;
}

export interface ServiceItem {
  id: string;
  number: string; // e.g. "01"
  title: string;
  description: string;
  deliverables: string[];
  technologies: string[];
  displayOrder: number;
  status: ContentStatus;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  isRead: boolean;
  replied?: boolean;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size: string;
  mimeType: string;
  uploadedAt: string;
  aspectRatio: string;
}

export interface ApiLogEntry {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  status: number;
  durationMs: number;
  requestPayload?: any;
  responsePayload?: any;
}
