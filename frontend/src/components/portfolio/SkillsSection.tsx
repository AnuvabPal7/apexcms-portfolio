import React, { useState } from 'react';
import { SkillItem } from '../../types/cms';

interface SkillsSectionProps {
  skills: SkillItem[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const categories = ['All', 'Backend & Cloud', 'Frontend', 'Database & Architecture', 'DevOps & Tooling'];

  // Group by category when 'All' is selected
  const categoriesToRender = selectedCat === 'All'
    ? ['Backend & Cloud', 'Frontend', 'Database & Architecture', 'DevOps & Tooling']
    : [selectedCat];

  return (
    <section id="skills" className="py-20 border-b border-neutral-900 bg-neutral-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-neutral-900 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
              Capabilities & Tooling
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-100">
              Technical Stack & Skills
            </h2>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800 overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCat === cat
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped Skills Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {categoriesToRender.map((cat) => {
            const catSkills = skills.filter(s => s.category === cat);
            if (catSkills.length === 0) return null;

            return (
              <div key={cat} className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
                <h3 className="text-base font-bold text-neutral-200 uppercase tracking-wider mb-6 flex items-center justify-between">
                  <span>{cat}</span>
                  <span className="text-xs font-mono text-neutral-500 font-normal">{catSkills.length} competencies</span>
                </h3>

                <div className="space-y-5">
                  {catSkills.map((skill) => (
                    <div key={skill.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-medium text-neutral-200 flex items-center gap-2">
                          {skill.highlight && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                          <span>{skill.name}</span>
                        </span>
                        <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
                          <span className="text-neutral-500">{skill.years} yrs</span>
                          <span className="text-amber-400/90 tabular-nums font-semibold">{skill.proficiency}%</span>
                        </div>
                      </div>

                      {/* Clean hairline progress track */}
                      <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
