import React from 'react';
import { ProjectItem } from '../../types/cms';
import { X, ExternalLink, Github, CheckCircle2, Layers } from 'lucide-react';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Frame */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/80 mb-6">
          <img
            src={project.image}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 text-xs font-mono text-neutral-300">
            {project.category} · Completed {project.completedYear}
          </div>
        </div>

        {/* Header Info */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100 mb-2">
            {project.title}
          </h2>
          <p className="text-neutral-300 text-base leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Outcome metric banner if present */}
        {project.outcomeMetric && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-neutral-200 font-medium">
              Impact Highlight: <span className="text-emerald-300">{project.outcomeMetric}</span>
            </div>
          </div>
        )}

        {/* Long Description */}
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
            Architecture & Implementation
          </h3>
          <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
            {project.longDescription}
          </p>
        </div>

        {/* Architecture details bullets */}
        {project.architectureDetails && project.architectureDetails.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> Key Engineering Decisions
            </h3>
            <ul className="space-y-2">
              {project.architectureDetails.map((detail, idx) => (
                <li key={idx} className="text-sm text-neutral-300 flex items-start gap-2">
                  <span className="text-amber-400/80 font-mono mt-0.5">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technologies - clean unboxed metadata with separators */}
        <div className="mb-8 pt-4 border-t border-neutral-800">
          <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block mb-2">
            Technology Stack
          </span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-300">
            {project.technologies.map((tech, i) => (
              <React.Fragment key={tech}>
                <span className="font-medium text-neutral-200">{tech}</span>
                {i < project.technologies.length - 1 && (
                  <span className="text-neutral-600 font-mono" aria-hidden="true">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm font-medium transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View Source</span>
              </a>
            )}
            {project.liveUrl && project.liveUrl !== '#cms' && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-sm font-semibold transition-colors"
              >
                <span>Live Deployment</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
