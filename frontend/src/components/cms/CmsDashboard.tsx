import React from 'react';
import { 
  FolderKanban, 
  Cpu, 
  FileText, 
  MessageSquare, 
  Image as ImageIcon, 
  Briefcase, 
  Star, 
  ArrowUpRight, 
  
  
  Sparkles,
  
  CheckCircle2
} from 'lucide-react';
import { cmsApi } from '../../services/api';
import { useToast } from '../common/Toast';

interface CmsDashboardProps {
  onNavigate: (tab: string) => void;
  onPreviewLive: () => void;
}

export const CmsDashboard: React.FC<CmsDashboardProps> = ({ onNavigate, onPreviewLive }) => {
  const {} = useToast();
  const profile = cmsApi.getProfile();
  const projects = cmsApi.getProjects(true);
  const skills = cmsApi.getSkills(true);
  const blogs = cmsApi.getBlogs(true);
  const experiences = cmsApi.getExperiences(true);
  const services = cmsApi.getServices(true);
  const testimonials = cmsApi.getTestimonials(true);
  const messages = cmsApi.getMessages();
  const media = cmsApi.getMedia();
  const unreadMessages = messages.filter(m => !m.isRead).length;

  const publishedProjects = projects.filter(p => p.status === 'published').length;
  const draftProjects = projects.filter(p => p.status === 'draft').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Apex Custom CMS · Headless Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-100">
            Welcome back, {profile.name}
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-0.5">
            Manage public portfolio models, draft content, media assets, and view inbound inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onPreviewLive}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>Preview Live Site</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>


        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Projects Metric */}
        <div 
          onClick={() => onNavigate('projects')}
          className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Projects</span>
            <FolderKanban className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-100 tabular-nums">
            {projects.length}
          </div>
          <div className="text-[11px] text-neutral-500 font-mono mt-1">
            {publishedProjects} published · {draftProjects} drafts
          </div>
        </div>

        {/* Skills Metric */}
        <div 
          onClick={() => onNavigate('skills')}
          className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Skills</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-100 tabular-nums">
            {skills.length}
          </div>
          <div className="text-[11px] text-neutral-500 font-mono mt-1">
            Across 4 categories
          </div>
        </div>

        {/* Blog Articles Metric */}
        <div 
          onClick={() => onNavigate('blogs')}
          className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Blog Posts</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-100 tabular-nums">
            {blogs.length}
          </div>
          <div className="text-[11px] text-neutral-500 font-mono mt-1">
            Markdown formatted
          </div>
        </div>

        {/* Inbound Messages Metric */}
        <div 
          onClick={() => onNavigate('messages')}
          className={`p-5 rounded-2xl border cursor-pointer transition-colors ${
            unreadMessages > 0
              ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
              : 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Inbox</span>
            <MessageSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-100 tabular-nums flex items-center gap-2">
            <span>{messages.length}</span>
            {unreadMessages > 0 && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 font-bold">
                {unreadMessages} new
              </span>
            )}
          </div>
          <div className="text-[11px] text-neutral-500 font-mono mt-1">
            From contact form POST /contact
          </div>
        </div>

      </div>

      {/* Content Models Table & Quick Jump */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Content Collection Summary */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-neutral-100">
              CMS Content Collections
            </h2>
            <span className="text-xs font-mono text-neutral-500">Database Models: 8</span>
          </div>

          <div className="divide-y divide-neutral-800/60">
            
            <div className="py-3.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <FolderKanban className="w-4 h-4 text-neutral-400" />
                <span className="font-medium text-neutral-200">Projects</span>
                <span className="text-xs text-neutral-500 font-mono">/api/projects</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-neutral-400">{projects.length} entries</span>
                <button
                  onClick={() => onNavigate('projects')}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>

            <div className="py-3.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span className="font-medium text-neutral-200">Blogs</span>
                <span className="text-xs text-neutral-500 font-mono">/api/blogs</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-neutral-400">{blogs.length} entries</span>
                <button
                  onClick={() => onNavigate('blogs')}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>

            <div className="py-3.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-neutral-400" />
                <span className="font-medium text-neutral-200">Skills</span>
                <span className="text-xs text-neutral-500 font-mono">/api/skills</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-neutral-400">{skills.length} entries</span>
                <button
                  onClick={() => onNavigate('skills')}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>

            <div className="py-3.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-neutral-400" />
                <span className="font-medium text-neutral-200">Experience Timeline</span>
                <span className="text-xs text-neutral-500 font-mono">/api/experience</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-neutral-400">{experiences.length} entries</span>
                <button
                  onClick={() => onNavigate('experience')}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>

            <div className="py-3.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-neutral-400" />
                <span className="font-medium text-neutral-200">Services</span>
                <span className="text-xs text-neutral-500 font-mono">/api/services</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-neutral-400">{services.length} entries</span>
                <button
                  onClick={() => onNavigate('services')}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>

            <div className="py-3.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-neutral-400" />
                <span className="font-medium text-neutral-200">Testimonials</span>
                <span className="text-xs text-neutral-500 font-mono">/api/testimonials</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-neutral-400">{testimonials.length} entries</span>
                <button
                  onClick={() => onNavigate('testimonials')}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>

            <div className="py-3.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-neutral-400" />
                <span className="font-medium text-neutral-200">Media Assets</span>
                <span className="text-xs text-neutral-500 font-mono">/api/upload/image</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-neutral-400">{media.length} files</span>
                <button
                  onClick={() => onNavigate('media')}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Architecture & Security Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
            <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>System & Auth Architecture</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
                <div className="text-neutral-400 font-medium mb-1">Auth Mechanism</div>
                <div className="font-mono text-emerald-300">Stateless JWT Bearer Token</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Role: ADMIN (Full CRUD)</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
                <div className="text-neutral-400 font-medium mb-1">Backend Framework</div>
                <div className="font-mono text-amber-300">Java 21 · Spring Boot 3.3 REST API</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
                <div className="text-neutral-400 font-medium mb-1">Database Model</div>
                <div className="font-mono text-sky-300">PostgreSQL + Spring Data JPA</div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
