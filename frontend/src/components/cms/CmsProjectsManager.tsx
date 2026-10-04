import React, { useState } from 'react';
import { ProjectItem, ContentStatus } from '../../types/cms';
import { cmsApi } from '../../services/api';
import { useToast } from '../common/Toast';
import { Plus, Search, Edit2, Trash2, CheckCircle2, FileQuestion } from 'lucide-react';

interface CmsProjectsManagerProps {
  onRefresh: () => void;
}

export const CmsProjectsManager: React.FC<CmsProjectsManagerProps> = ({ onRefresh }) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projects = cmsApi.getProjects(true);
  const mediaList = cmsApi.getMedia();

  const filtered = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingProject({
      title: '',
      slug: '',
      description: '',
      longDescription: '',
      category: 'Full-Stack',
      technologies: ['React', 'Spring Boot', 'PostgreSQL'],
      image: mediaList[0]?.url || '',
      githubUrl: 'https://github.com/',
      liveUrl: 'https://demo.dev',
      outcomeMetric: '',
      displayOrder: projects.length + 1,
      status: 'published',
      featured: false,
      completedYear: '2026',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: ProjectItem) => {
    setEditingProject({ ...project });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      cmsApi.deleteProject(id);
      showToast(`Project "${title}" deleted via DELETE /api/projects/${id}`);
      onRefresh();
    }
  };

  const handleToggleStatus = (project: ProjectItem) => {
    const nextStatus: ContentStatus = project.status === 'published' ? 'draft' : 'published';
    cmsApi.saveProject({
      ...project,
      status: nextStatus,
    });
    showToast(`Project "${project.title}" set to ${nextStatus.toUpperCase()}`);
    onRefresh();
  };

  const handleToggleFeatured = (project: ProjectItem) => {
    cmsApi.saveProject({
      ...project,
      featured: !project.featured,
    });
    showToast(`Featured state toggled for "${project.title}"`);
    onRefresh();
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.description) {
      showToast('Title and description are required', 'error');
      return;
    }

    const payload = {
      ...editingProject,
      slug: editingProject.slug || editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      technologies: Array.isArray(editingProject.technologies) 
        ? editingProject.technologies 
        : String(editingProject.technologies || '').split(',').map(s => s.trim()).filter(Boolean),
    } as any;

    cmsApi.saveProject(payload);
    showToast(editingProject.id ? 'Project updated via PUT /api/projects/:id' : 'Project created via POST /api/projects');
    setIsModalOpen(false);
    setEditingProject(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Projects Manager</h2>
          <p className="text-xs text-neutral-400 font-mono">REST Content API: /api/projects</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 self-start sm:self-auto">
          {(['all', 'published', 'draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                statusFilter === st
                  ? 'bg-neutral-800 text-neutral-100 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <table className="w-full text-left text-xs text-neutral-300 border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/60 font-semibold text-neutral-400 uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4 w-12 text-center">Order</th>
              <th className="py-3.5 px-4">Project</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-center">Featured</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {filtered.map((project) => (
              <tr key={project.id} className="hover:bg-neutral-800/30 transition-colors">
                
                {/* Order */}
                <td className="py-3.5 px-4 text-center font-mono text-neutral-500">
                  {project.displayOrder}
                </td>

                {/* Project Info */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700/60">
                      <img
                        src={project.image}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="max-w-xs sm:max-w-md">
                      <div className="font-bold text-neutral-100 text-sm hover:text-amber-400 transition-colors">
                        {project.title}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate">
                        {project.description}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4 font-mono text-neutral-300">
                  {project.category}
                </td>

                {/* Status Toggle Button */}
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => handleToggleStatus(project)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                      project.status === 'published'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/60'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-800/60 hover:bg-amber-900/60'
                    }`}
                  >
                    {project.status === 'published' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>PUBLISHED</span>
                      </>
                    ) : (
                      <>
                        <FileQuestion className="w-3 h-3 text-amber-400" />
                        <span>DRAFT</span>
                      </>
                    )}
                  </button>
                </td>

                {/* Featured Toggle */}
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => handleToggleFeatured(project)}
                    className={`text-xs px-2 py-0.5 rounded font-mono transition-colors ${
                      project.featured
                        ? 'text-amber-400 bg-amber-950/60 border border-amber-800/60 font-semibold'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    {project.featured ? '★ Yes' : 'No'}
                  </button>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(project)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-neutral-100 transition-colors"
                      title="Edit project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id, project.title)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-neutral-500 text-xs">
            No projects matched the search criteria.
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-neutral-100 mb-1">
              {editingProject.id ? 'Edit Project' : 'Create New Project'}
            </h3>
            <p className="text-xs text-neutral-400 font-mono mb-6">
              Spring Data JPA Model · Project Entity
            </p>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editingProject.category || 'Full-Stack'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="AI Integration">AI Integration</option>
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="SaaS & Enterprise">SaaS & Enterprise</option>
                    <option value="Developer Tool">Developer Tool</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Long Architecture Description
                </label>
                <textarea
                  rows={3}
                  value={editingProject.longDescription || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Technologies (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(editingProject.technologies) ? editingProject.technologies.join(', ') : editingProject.technologies || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="React, Spring Boot, PostgreSQL"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Outcome Metric
                  </label>
                  <input
                    type="text"
                    value={editingProject.outcomeMetric || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, outcomeMetric: e.target.value })}
                    placeholder="e.g. 64% latency reduction"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Image Picker */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center justify-between">
                  <span>Showcase Image URL</span>
                  <span className="text-[11px] text-neutral-500 font-mono">Select from media assets below</span>
                </label>
                <input
                  type="text"
                  value={editingProject.image || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400 mb-2"
                />

                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {mediaList.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setEditingProject({ ...editingProject, image: m.url })}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        editingProject.image === m.url ? 'border-amber-400 scale-95' : 'border-neutral-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingProject.displayOrder || 1}
                    onChange={(e) => setEditingProject({ ...editingProject, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={editingProject.status || 'published'}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden from Public)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Featured Item
                  </label>
                  <select
                    value={editingProject.featured ? 'true' : 'false'}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.value === 'true' })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="true">Featured (★)</option>
                    <option value="false">Standard</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold transition-colors"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
