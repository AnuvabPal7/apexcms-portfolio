import React, { useState } from 'react';
import { SkillItem, ContentStatus } from '../../types/cms';
import { cmsApi } from '../../services/api';
import { useToast } from '../common/Toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface CmsSkillsManagerProps {
  onRefresh: () => void;
}

export const CmsSkillsManager: React.FC<CmsSkillsManagerProps> = ({ onRefresh }) => {
  const { showToast } = useToast();
  const [editingSkill, setEditingSkill] = useState<Partial<SkillItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const skills = cmsApi.getSkills(true);

  const handleOpenAdd = () => {
    setEditingSkill({
      name: '',
      category: 'Backend & Cloud',
      proficiency: 90,
      years: 4,
      highlight: false,
      displayOrder: skills.length + 1,
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: SkillItem) => {
    setEditingSkill({ ...skill });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete skill "${name}"?`)) {
      cmsApi.deleteSkill(id);
      showToast(`Skill deleted via DELETE /api/skills/${id}`);
      onRefresh();
    }
  };

  const handleToggleStatus = (skill: SkillItem) => {
    const nextStatus: ContentStatus = skill.status === 'published' ? 'draft' : 'published';
    cmsApi.saveSkill({
      ...skill,
      status: nextStatus,
    });
    showToast(`Skill set to ${nextStatus.toUpperCase()}`);
    onRefresh();
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill?.name) {
      showToast('Skill name is required', 'error');
      return;
    }
    cmsApi.saveSkill(editingSkill as any);
    showToast(editingSkill.id ? 'Skill updated' : 'Skill created');
    setIsModalOpen(false);
    setEditingSkill(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Skills & Tech Stack</h2>
          <p className="text-xs text-neutral-400 font-mono">REST Content API: /api/skills</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/60 font-semibold text-neutral-400 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 w-12 text-center">Order</th>
              <th className="py-3 px-4">Skill Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Proficiency</th>
              <th className="py-3 px-4">Experience</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {skills.map((skill) => (
              <tr key={skill.id} className="hover:bg-neutral-800/30 transition-colors">
                <td className="py-3 px-4 text-center font-mono text-neutral-500">{skill.displayOrder}</td>
                <td className="py-3 px-4 font-bold text-neutral-100 flex items-center gap-2">
                  {skill.highlight && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  <span>{skill.name}</span>
                </td>
                <td className="py-3 px-4 text-neutral-300 font-mono">{skill.category}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${skill.proficiency}%` }} />
                    </div>
                    <span className="font-mono text-neutral-400 tabular-nums">{skill.proficiency}%</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-neutral-400">{skill.years} years</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleToggleStatus(skill)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      skill.status === 'published' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60' : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                    }`}
                  >
                    {skill.status.toUpperCase()}
                  </button>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(skill)}
                      className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id, skill.name)}
                      className="p-1.5 rounded bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-neutral-100 mb-4">
              {editingSkill.id ? 'Edit Skill Item' : 'New Skill Item'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Category</label>
                <select
                  value={editingSkill.category || 'Backend & Cloud'}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="Backend & Cloud">Backend & Cloud</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Database & Architecture">Database & Architecture</option>
                  <option value="DevOps & Tooling">DevOps & Tooling</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Proficiency: {editingSkill.proficiency}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={editingSkill.proficiency || 85}
                    onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) })}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Years Experience</label>
                  <input
                    type="number"
                    value={editingSkill.years || 3}
                    onChange={(e) => setEditingSkill({ ...editingSkill, years: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs font-mono"
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
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
