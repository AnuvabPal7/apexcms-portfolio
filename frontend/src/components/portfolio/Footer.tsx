import React from 'react';
import { ProfileContent } from '../../types/cms';
import { Github, Linkedin, ArrowUp } from 'lucide-react';

interface FooterProps {
  profile: ProfileContent;
  onOpenCms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onOpenCms }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 bg-neutral-950 border-t border-neutral-900 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-900">
          
          {/* Brand & Kicker */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-base font-bold text-neutral-100 tracking-tight">
              {profile.name}
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-neutral-400">
            <a href="#about" className="hover:text-neutral-200 transition-colors">About</a>
            <a href="#projects" className="hover:text-neutral-200 transition-colors">Projects</a>
            <a href="#skills" className="hover:text-neutral-200 transition-colors">Skills</a>
            <a href="#experience" className="hover:text-neutral-200 transition-colors">Experience</a>
            <a href="#services" className="hover:text-neutral-200 transition-colors">Services</a>
            <a href="#blog" className="hover:text-neutral-200 transition-colors">Writing</a>
            <button onClick={onOpenCms} className="hover:text-neutral-200 transition-colors">
              CMS Admin
            </button>
          </div>

          {/* Socials & Back to Top */}
          <div className="flex items-center gap-4">
            {profile.githubUrl && (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            )}
            {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            )}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Quiet copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3">
          <div>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span>Spring Boot 3.3</span>
            <span aria-hidden="true">·</span>
            <span>React 19</span>
            <span aria-hidden="true">·</span>
            <span>PostgreSQL</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
