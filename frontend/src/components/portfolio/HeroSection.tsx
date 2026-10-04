import React from 'react';
import { ProfileContent } from '../../types/cms';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

interface HeroSectionProps {
  profile: ProfileContent;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-neutral-900 overflow-hidden">
      {/* Subtle ambient gradient mesh */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-neutral-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Availability & Kicker - Clean unboxed text with typographic separator */}
            <div className="flex items-center gap-2.5 text-xs text-neutral-400 font-mono tracking-wide mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 font-medium">{profile.availability}</span>
              {profile.heroKicker && (
                <>
                  <span aria-hidden="true" className="text-neutral-700">/</span>
                  <span className="text-neutral-300">{profile.heroKicker}</span>
                </>
              )}
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-100 text-balance leading-[1.1] mb-6">
              {profile.tagline || profile.roleTitle}
            </h1>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a
                href="#projects"
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-sm font-semibold transition-colors shadow-sm inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span>Explore Selected Projects</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-sm font-medium transition-colors inline-flex items-center gap-2 whitespace-nowrap"
              >
                <Mail className="w-4 h-4 text-neutral-400" />
                <span>Get In Touch</span>
              </a>

            </div>

            {/* Location & social links (each shown only when filled in) */}
            {(profile.location || profile.githubUrl || profile.linkedinUrl) && (
              <div className="flex flex-wrap items-center gap-5 text-xs text-neutral-400 pt-6 border-t border-neutral-900">
                {profile.location && <span className="text-neutral-500 font-mono">{profile.location}</span>}
                {profile.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="hover:text-neutral-200 transition-colors inline-flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Profile</span>
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-neutral-200 transition-colors inline-flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            )}

          </div>

          {/* Right Column: Visual Frame & Quantitative Rigor */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            <div className="relative w-full max-w-md">
              
              {/* Media Frame */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/80 shadow-2xl">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl font-bold text-neutral-700">
                    {(profile.name || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
                
                {/* Overlay Name & Role */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800/80">
                  <div className="text-base font-bold text-neutral-100">{profile.name}</div>
                  <div className="text-xs text-neutral-400 truncate">{profile.roleTitle}</div>
                </div>
              </div>

              {/* Stats card: only the numbers you filled in (non-zero) are shown */}
              {(() => {
                const { yearsExperience, shippedProjects, clientSatisfactionRate } = profile.stats;
                const items = [
                  yearsExperience > 0 && { value: `${yearsExperience}+`, label: 'Years Exp' },
                  shippedProjects > 0 && { value: `${shippedProjects}`, label: 'Shipped Projects' },
                  clientSatisfactionRate > 0 && { value: `${clientSatisfactionRate}%`, label: 'Client Satisfaction' },
                ].filter(Boolean) as { value: string; label: string }[];
                if (items.length === 0) return null;
                return (
                  <div className="flex divide-x divide-neutral-800 mt-4 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800/80">
                    {items.map((item) => (
                      <div key={item.label} className="flex-1 text-center p-2">
                        <div className="text-xl font-bold font-mono text-neutral-100 tabular-nums">{item.value}</div>
                        <div className="text-[11px] text-neutral-500 font-medium">{item.label}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
