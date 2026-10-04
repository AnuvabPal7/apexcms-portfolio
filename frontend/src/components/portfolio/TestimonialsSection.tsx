import React from 'react';
import { TestimonialItem } from '../../types/cms';
import { Star, Quote, CheckCircle } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <section id="testimonials" className="py-20 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-neutral-900 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
              Social Proof & Endorsements
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-100">
              Client & Lead Testimonials
            </h2>
          </div>
          <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
            Attributable feedback from engineering vice presidents, CTOs, and principal product managers.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800/80"
            >
              <div>
                {/* Quote Icon & Stars */}
                <div className="flex items-center justify-between mb-6">
                  <Quote className="w-8 h-8 text-neutral-700" />
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>

                {/* Concrete outcome metric */}
                {t.outcomeMetric && (
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-6 pb-6 border-b border-neutral-800/60">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Outcome: {t.outcomeMetric}</span>
                  </div>
                )}
              </div>

              {/* Attribution */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden shrink-0 border border-neutral-700">
                  {t.avatarUrl ? (
                    <img
                      src={t.avatarUrl}
                      alt={t.clientName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-neutral-400 text-xs">
                      {t.clientName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-100">{t.clientName}</div>
                  <div className="text-xs text-neutral-400 font-mono">
                    {t.role} · <span className="text-neutral-300">{t.company}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
