import React, { useState } from 'react';
import { BlogItem, ContentStatus } from '../../types/cms';
import { cmsApi } from '../../services/api';
import { useToast } from '../common/Toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface CmsBlogManagerProps {
  onRefresh: () => void;
}

export const CmsBlogManager: React.FC<CmsBlogManagerProps> = ({ onRefresh }) => {
  const { showToast } = useToast();
  const [editingBlog, setEditingBlog] = useState<Partial<BlogItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const blogs = cmsApi.getBlogs(true);
  const mediaList = cmsApi.getMedia();

  const handleOpenAdd = () => {
    setEditingBlog({
      title: '',
      slug: '',
      excerpt: '',
      content: '### Overview\n\nWrite your technical article markdown here...',
      author: cmsApi.getProfile().name || 'Author',
      readTime: '5 min read',
      tags: ['Spring Boot', 'Architecture'],
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'published',
      coverImage: mediaList[1]?.url || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog: BlogItem) => {
    setEditingBlog({ ...blog });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete article "${title}"?`)) {
      cmsApi.deleteBlog(id);
      showToast(`Article deleted via DELETE /api/blogs/${id}`);
      onRefresh();
    }
  };

  const handleToggleStatus = (blog: BlogItem) => {
    const nextStatus: ContentStatus = blog.status === 'published' ? 'draft' : 'published';
    cmsApi.saveBlog({
      ...blog,
      status: nextStatus,
    });
    showToast(`Article set to ${nextStatus.toUpperCase()}`);
    onRefresh();
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.title || !editingBlog?.excerpt) {
      showToast('Title and excerpt are required', 'error');
      return;
    }
    const payload = {
      ...editingBlog,
      slug: editingBlog.slug || editingBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tags: Array.isArray(editingBlog.tags)
        ? editingBlog.tags
        : String(editingBlog.tags || '').split(',').map(s => s.trim()).filter(Boolean),
    } as any;

    cmsApi.saveBlog(payload);
    showToast(editingBlog.id ? 'Article updated' : 'Article published');
    setIsModalOpen(false);
    setEditingBlog(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Articles & Writing</h2>
          <p className="text-xs text-neutral-400 font-mono">REST Content API: /api/blogs</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span>{blog.publishedAt}</span>
                <span>·</span>
                <span>{blog.readTime}</span>
              </div>
              <h3 className="text-base font-bold text-neutral-100 hover:text-amber-400 transition-colors">
                {blog.title}
              </h3>
              <p className="text-xs text-neutral-400 line-clamp-1">
                {blog.excerpt}
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <button
                onClick={() => handleToggleStatus(blog)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono ${
                  blog.status === 'published'
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                    : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                }`}
              >
                {blog.status.toUpperCase()}
              </button>

              <button
                onClick={() => handleOpenEdit(blog)}
                className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleDelete(blog.id, blog.title)}
                className="p-1.5 rounded bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-neutral-100 mb-4">
              {editingBlog.id ? 'Edit Article' : 'Compose New Article'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editingBlog.title || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Excerpt / Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={editingBlog.excerpt || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Article Content (Markdown supported)</label>
                <textarea
                  rows={8}
                  value={editingBlog.content || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingBlog.tags) ? editingBlog.tags.join(', ') : editingBlog.tags || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, tags: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={editingBlog.readTime || '5 min read'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
