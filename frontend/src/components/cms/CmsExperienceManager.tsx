import React, { useState } from 'react';
import { ExperienceItem } from '../../types/cms';
import { cmsApi } from '../../services/api';
import { useToast } from '../common/Toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface CmsExperienceManagerProps {
  onRefresh: () => void;
}

export const CmsExperienceManager: React.FC<CmsExperienceManagerProps> = ({ onRefresh }) => {
  const { showToast } = useToast();
  const [editingExp, setEditingExp] = useState<Partial<ExperienceItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const experiences = cmsApi.getExperiences(true);

  const handleOpenAdd = () => {
    setEditingExp({
      company: '',
      position: '',
      period: '2025 — Present',
      location: 'Remote',
      type: 'Full-time',
      summary: '',
      achievements: ['Architected core distributed service', 'Cut median query latency by 50%'],
      technologies: ['Java Spring Boot', 'PostgreSQL', 'React'],
      displayOrder: experiences.length + 1,
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ExperienceItem) => {
    setEditingExp({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, company: string) => {
    if (confirm(`Delete experience record for "${company}"?`)) {
      cmsApi.deleteExperience(id);
      showToast(`Record deleted via DELETE /api/experience/${id}`);
      onRefresh();
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp?.company || !editingExp?.position) {
      showToast('Company and position are required', 'error');
      return;
    }
    const payload = {
      ...editingExp,
      achievements: Array.isArray(editingExp.achievements)
        ? editingExp.achievements
        : String(editingExp.achievements || '').split('\n').map(s => s.trim()).filter(Boolean),
      technologies: Array.isArray(editingExp.technologies)
        ? editingExp.technologies
        : String(editingExp.technologies || '').split(',').map(s => s.trim()).filter(Boolean),
    } as any;

    cmsApi.saveExperience(payload);
    showToast(editingExp.id ? 'Experience updated' : 'Experience created');
    setIsModalOpen(false);
    setEditingExp(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Work Experience & Timeline</h2>
          <p className="text-xs text-neutral-400 font-mono">REST Content API: /api/experience</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span className="text-amber-400 font-bold">{exp.company}</span>
                <span>·</span>
                <span>{exp.period}</span>
                <span>·</span>
                <span>{exp.location}</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-100 mt-0.5">
                {exp.position}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2 max-w-xl">
                {exp.summary}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenEdit(exp)}
                className="p-2 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(exp.id, exp.company)}
                className="p-2 rounded bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-neutral-100 mb-4">
              {editingExp.id ? 'Edit Position' : 'Add New Position'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.company || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Position *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.position || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, position: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Period (e.g. 2024 — Present)</label>
                  <input
                    type="text"
                    value={editingExp.period || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingExp.location || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Role Summary</label>
                <textarea
                  rows={2}
                  value={editingExp.summary || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Bullet Achievements (one per line)
                </label>
                <textarea
                  rows={3}
                  value={Array.isArray(editingExp.achievements) ? editingExp.achievements.join('\n') : editingExp.achievements || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, achievements: e.target.value.split('\n') })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs font-mono resize-none"
                />
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
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
