import React from 'react';
import { BlogItem } from '../../types/cms';
import { ArrowUpRight, Clock, Calendar } from 'lucide-react';

interface BlogSectionProps {
  blogs: BlogItem[];
  onSelectBlog: (blog: BlogItem) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogs, onSelectBlog }) => {
  return (
    <section id="blog" className="py-20 border-b border-neutral-900 bg-neutral-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-neutral-900 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
              Engineering Notes & Publications
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-100">
              Technical Writing
            </h2>
          </div>
          <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
            In-depth reflections on custom CMS design, Spring Boot architecture, PostgreSQL query tuning, and decoupled frontend systems.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              onClick={() => onSelectBlog(blog)}
              className="group flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <div>
                {/* Clean unboxed metadata with separators */}
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    <span>{blog.publishedAt}</span>
                  </span>
                  <span aria-hidden="true" className="text-neutral-700">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    <span>{blog.readTime}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-neutral-100 group-hover:text-amber-300 transition-colors mb-3 leading-snug">
                  {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-neutral-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {blog.excerpt}
                </p>
              </div>

              {/* Card Footer: Tags & Read Link */}
              <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
                  {blog.tags.slice(0, 2).map((tag, tIdx) => (
                    <React.Fragment key={tag}>
                      <span>#{tag}</span>
                      {tIdx < Math.min(blog.tags.length, 2) - 1 && (
                        <span className="text-neutral-700">/</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <span className="text-xs font-semibold text-amber-400 group-hover:underline inline-flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
