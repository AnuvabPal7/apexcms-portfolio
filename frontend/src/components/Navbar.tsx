import React from 'react';
import { Shield, Layout } from 'lucide-react';

export type AppViewMode = 'portfolio' | 'cms';

interface NavbarProps {
  currentMode: AppViewMode;
  onSelectMode: (mode: AppViewMode) => void;
  brandName: string;
  /** Portfolio/CMS switcher is only for the logged-in owner, not for public visitors. */
  showSwitcher: boolean;
}

const modeButton = (active: boolean) =>
  `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
    active ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
  }`;

export const Navbar: React.FC<NavbarProps> = ({ currentMode, onSelectMode, brandName, showSwitcher }) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onSelectMode('portfolio')}
            className="text-lg font-bold tracking-tight text-neutral-100 hover:text-amber-400 transition-colors truncate text-left"
          >
            {brandName}
          </button>

          {currentMode === 'portfolio' && (
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-400">
              <a href="#projects" className="hover:text-neutral-100 transition-colors">Projects</a>
              <a href="#skills" className="hover:text-neutral-100 transition-colors">Skills</a>
              <a href="#experience" className="hover:text-neutral-100 transition-colors">Experience</a>
              <a href="#services" className="hover:text-neutral-100 transition-colors">Services</a>
              <a href="#blog" className="hover:text-neutral-100 transition-colors">Writing</a>
              <a href="#contact" className="hover:text-neutral-100 transition-colors">Contact</a>
            </nav>
          )}

          {showSwitcher ? (
            <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
              <button onClick={() => onSelectMode('portfolio')} className={modeButton(currentMode === 'portfolio')}>
                <Layout className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Portfolio</span>
              </button>
              <button onClick={() => onSelectMode('cms')} className={modeButton(currentMode === 'cms')}>
                <Shield className="w-3.5 h-3.5" />
                <span>CMS Admin</span>
              </button>
            </div>
          ) : (
            <span />
          )}
        </div>
      </div>
    </header>
  );
};
