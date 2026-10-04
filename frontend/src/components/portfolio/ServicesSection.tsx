import React from 'react';
import { ServiceItem } from '../../types/cms';
import { Check } from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  return (
    <section id="services" className="py-20 border-b border-neutral-900 bg-neutral-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-neutral-900 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
              Engagement & Offerings
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-100">
              Specialized Services
            </h2>
          </div>
          <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
            High-leverage engineering services for startups and established teams requiring hardened architectures and decoupled frontends.
          </p>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="flex flex-col justify-between p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
            >
              <div>
                {/* Natural Editorial Numbering (ALLOWED by skill constitution: e.g. 01., 02.) */}
                <div className="text-2xl font-mono font-bold text-amber-400 mb-4">
                  {srv.number}.
                </div>

                <h3 className="text-xl font-bold text-neutral-100 mb-3">
                  {srv.title}
                </h3>

                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  {srv.description}
                </p>

                {/* Deliverables List */}
                <div className="space-y-2.5 mb-8">
                  <div className="text-xs uppercase tracking-wider font-semibold text-neutral-300">
                    Key Deliverables
                  </div>
                  {srv.deliverables.map((del, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies unboxed list */}
              <div className="pt-4 border-t border-neutral-800/80 text-xs text-neutral-400">
                <div className="flex flex-wrap items-center gap-1.5 font-mono">
                  {srv.technologies.map((t, tIdx) => (
                    <React.Fragment key={t}>
                      <span className="text-neutral-300">{t}</span>
                      {tIdx < srv.technologies.length - 1 && (
                        <span className="text-neutral-600">·</span>
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
