import React, { useState } from 'react';
import { ProjectItem } from '../../types/cms';
import { ArrowUpRight } from 'lucide-react';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, onSelectProject }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'AI Integration', 'Full-Stack', 'SaaS & Enterprise', 'Developer Tool'];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-neutral-900 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
              Featured Architecture & Builds
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-100">
              Selected Projects
            </h2>
          </div>

          {/* Interactive Filter Tabs - Functional Buttons with segmented states */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800 self-start md:self-auto overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group flex flex-col justify-between rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-200 overflow-hidden cursor-pointer hover:-translate-y-0.5"
            >
              <div>
                {/* Media Image Frame */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Clean unboxed category overlay */}
                  <div className="absolute top-3 left-3 text-[11px] font-mono text-neutral-300 bg-neutral-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-neutral-800">
                    {project.category}
                  </div>

                  {project.featured && (
                    <div className="absolute top-3 right-3 text-[11px] font-mono text-amber-300 bg-amber-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-amber-800/60">
                      ★ Featured
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-6">
                  
                  {/* Title and open icon */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-neutral-100 group-hover:text-amber-300 transition-colors">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
                  </div>

                  {/* Excerpt */}
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Outcome Metric if present */}
                  {project.outcomeMetric && (
                    <div className="text-xs text-emerald-400 font-mono mb-4 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="truncate">{project.outcomeMetric}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Clean unboxed tech list with dot separators */}
              <div className="px-6 pb-6 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400">
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 truncate max-w-[70%]">
                  {project.technologies.slice(0, 3).map((t, idx) => (
                    <React.Fragment key={t}>
                      <span className="text-neutral-300">{t}</span>
                      {idx < Math.min(project.technologies.length, 3) - 1 && (
                        <span className="text-neutral-600 font-mono">·</span>
                      )}
                    </React.Fragment>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-neutral-500">+{project.technologies.length - 3}</span>
                  )}
                </div>

                <span className="text-neutral-500 font-mono tabular-nums">
                  {project.completedYear}
                </span>
              </div>

            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl">
            <p className="text-neutral-400 text-sm">No projects currently published in this category.</p>
          </div>
        )}

      </div>
    </section>
  );
};
