import React from 'react';
import { ExperienceItem } from '../../types/cms';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  return (
    <section id="experience" className="py-20 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-neutral-900 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
              Career Trajectory & Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-100">
              Work Experience
            </h2>
          </div>
          <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
            Delivering production systems across distributed backend services, high-throughput financial portals, and full-stack web platforms.
          </p>
        </div>

        {/* Timeline List */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 sm:before:left-5 before:w-0.5 before:bg-neutral-800">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative flex items-start gap-4 sm:gap-6 group">
              
              {/* Timeline marker */}
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-neutral-900 border-2 border-neutral-700 group-hover:border-amber-400 transition-colors flex items-center justify-center shrink-0 z-10 mt-1">
                <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 group-hover:text-amber-400 transition-colors" />
              </div>

              {/* Card Container */}
              <div className="flex-1 p-6 sm:p-7 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-neutral-700 transition-colors">
                
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-100">
                      {exp.position}
                    </h3>
                    <div className="text-sm font-semibold text-amber-400/90">
                      {exp.company}
                    </div>
                  </div>

                  {/* Clean unboxed metadata with separators */}
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      <span>{exp.period}</span>
                    </span>
                    <span aria-hidden="true" className="text-neutral-700">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-500" />
                      <span>{exp.location}</span>
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-neutral-300 text-sm leading-relaxed mb-4">
                  {exp.summary}
                </p>

                {/* Key Achievements */}
                <ul className="space-y-2 mb-5">
                  {exp.achievements.map((item, aIdx) => (
                    <li key={aIdx} className="text-xs sm:text-sm text-neutral-300 flex items-start gap-2.5">
                      <span className="text-amber-400 font-mono text-xs mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech list - unboxed with dots */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400 pt-4 border-t border-neutral-800/60">
                  <span className="text-neutral-500 font-medium">Stack:</span>
                  {exp.technologies.map((tech, tIdx) => (
                    <React.Fragment key={tech}>
                      <span className="text-neutral-300">{tech}</span>
                      {tIdx < exp.technologies.length - 1 && (
                        <span className="text-neutral-600 font-mono">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
