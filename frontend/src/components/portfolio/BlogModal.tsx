import React from 'react';
import { BlogItem } from '../../types/cms';
import { X, Calendar, Clock, User } from 'lucide-react';

interface BlogModalProps {
  blog: BlogItem | null;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ blog, onClose }) => {
  if (!blog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {blog.coverImage && (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/80 mb-6">
            <img
              src={blog.coverImage}
              alt={blog.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Clean unboxed metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 mb-4">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-neutral-400" />
            <span>{blog.author}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>{blog.publishedAt}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>{blog.readTime}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100 mb-4 text-balance">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-xs text-amber-400/90 font-mono mb-6 pb-6 border-b border-neutral-800">
          {blog.tags.map((tag, idx) => (
            <React.Fragment key={tag}>
              <span>#{tag}</span>
              {idx < blog.tags.length - 1 && <span className="text-neutral-700">/</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="prose prose-invert max-w-none text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4">
          {blog.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-lg font-bold text-neutral-100 pt-4 pb-1">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('- ')) {
              return (
                <ul key={index} className="list-disc list-inside space-y-1.5 text-neutral-300 pl-2">
                  {paragraph.split('\n').map((line, liIdx) => (
                    <li key={liIdx}>{line.replace(/^- /, '')}</li>
                  ))}
                </ul>
              );
            }
            if (/^\d\.\s/.test(paragraph)) {
              return (
                <ol key={index} className="list-decimal list-inside space-y-1.5 text-neutral-300 pl-2">
                  {paragraph.split('\n').map((line, liIdx) => (
                    <li key={liIdx}>{line.replace(/^\d\.\s/, '')}</li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={index} className="text-neutral-300">
                {paragraph}
              </p>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm font-medium transition-colors"
          >
            Close Article
          </button>
        </div>
      </div>
    </div>
  );
};
