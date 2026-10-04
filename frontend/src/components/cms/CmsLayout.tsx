import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  User, 
  FolderKanban, 
  Cpu, 
  Briefcase, 
  FileText, 
  Sparkles, 
  Star, 
  Image as ImageIcon, 
  MessageSquare, 
  ExternalLink, 
  LogOut, 
  LogIn, 
  
  ShieldCheck,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cmsApi } from '../../services/api';
import { useToast } from '../common/Toast';
import { CmsDashboard } from './CmsDashboard';
import { CmsProfileEditor } from './CmsProfileEditor';
import { CmsProjectsManager } from './CmsProjectsManager';
import { CmsSkillsManager } from './CmsSkillsManager';
import { CmsExperienceManager } from './CmsExperienceManager';
import { CmsBlogManager } from './CmsBlogManager';
import { CmsServicesManager } from './CmsServicesManager';
import { CmsTestimonialsManager } from './CmsTestimonialsManager';
import { CmsMediaLibrary } from './CmsMediaLibrary';
import { CmsMessagesInbox } from './CmsMessagesInbox';
import { CmsLoginModal } from './CmsLoginModal';
import { CmsAccountSettings } from './CmsAccountSettings';

interface CmsLayoutProps {
  onViewPublicSite: () => void;
}

export const CmsLayout: React.FC<CmsLayoutProps> = ({ onViewPublicSite }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [authUser, setAuthUser] = useState(cmsApi.getAuthUser());
  const [isLoginOpen, setIsLoginOpen] = useState(() => !cmsApi.getAuthUser());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setRenderCount] = useState(0);

  const forceRefresh = () => setRenderCount(c => c + 1);

  useEffect(() => {
    const unsub = cmsApi.subscribe(() => {
      setAuthUser(cmsApi.getAuthUser());
      setRenderCount(c => c + 1);
    });
    return unsub;
  }, []);

  const handleLogout = () => {
    cmsApi.logout();
    showToast('Logged out of CMS admin.');
    setAuthUser(null);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'About / Profile', icon: User },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'blogs', label: 'Articles & Blogs', icon: FileText },
    { id: 'services', label: 'Services', icon: Sparkles },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'messages', label: 'Contact Inbox', icon: MessageSquare },
    { id: 'account', label: 'Account Settings', icon: User },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2 font-bold text-sm text-neutral-100">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Apex CMS Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-neutral-800 text-neutral-300"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-neutral-950 border-r border-neutral-800/80 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Brand & CMS Banner */}
          <div className="p-5 border-b border-neutral-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-neutral-950 font-black text-sm">
                A
              </div>
              <div>
                <div className="font-bold text-sm text-neutral-100 leading-none">Apex Headless CMS</div>
                <div className="text-[11px] font-mono text-neutral-500 mt-0.5">Admin Workspace</div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
              Content Collections
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30 font-semibold'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Account & Live View Actions */}
        <div className="p-4 border-t border-neutral-800/80 space-y-3 bg-neutral-950/60">
          {authUser ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-800 shrink-0 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-300">
                  {(authUser.name || '?').charAt(0).toUpperCase()}
                </div>
                <div className="truncate flex-1">
                  <div className="text-xs font-bold text-neutral-200 truncate">{authUser.name}</div>
                  <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Signed in</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={onViewPublicSite}
                  className="text-neutral-300 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <span>Public View</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                <button
                  onClick={handleLogout}
                  className="text-neutral-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Login with JWT</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        
        {/* Breadcrumb Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-neutral-800/80 text-xs text-neutral-400">
          <div className="flex items-center gap-2 font-mono">
            <span>Apex CMS</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-neutral-100 font-semibold capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onViewPublicSite}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Switch to Portfolio</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* View Switcher based on activeTab */}
        {!authUser && (
          <div className="p-10 text-center rounded-2xl bg-neutral-900 border border-neutral-800">
            <p className="text-neutral-300 mb-4">Sign in to manage your portfolio content.</p>
            <button onClick={() => setIsLoginOpen(true)} className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 text-sm font-semibold hover:bg-amber-300">
              Sign in
            </button>
          </div>
        )}
        {authUser && (<>
        {activeTab === 'dashboard' && (
          <CmsDashboard onNavigate={setActiveTab} onPreviewLive={onViewPublicSite} />
        )}
        {activeTab === 'profile' && <CmsProfileEditor onRefresh={forceRefresh} />}
        {activeTab === 'projects' && <CmsProjectsManager onRefresh={forceRefresh} />}
        {activeTab === 'skills' && <CmsSkillsManager onRefresh={forceRefresh} />}
        {activeTab === 'experience' && <CmsExperienceManager onRefresh={forceRefresh} />}
        {activeTab === 'blogs' && <CmsBlogManager onRefresh={forceRefresh} />}
        {activeTab === 'services' && <CmsServicesManager onRefresh={forceRefresh} />}
        {activeTab === 'testimonials' && <CmsTestimonialsManager onRefresh={forceRefresh} />}
        {activeTab === 'media' && <CmsMediaLibrary onRefresh={forceRefresh} />}
        {activeTab === 'messages' && <CmsMessagesInbox onRefresh={forceRefresh} />}
        {activeTab === 'account' && <CmsAccountSettings />}

        </>)}
      </main>

      {/* Login Modal */}
      <CmsLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => {
          setAuthUser(cmsApi.getAuthUser());
          forceRefresh();
        }}
      />
    </div>
  );
};
