import React, { useState } from 'react';
import { TestimonialItem } from '../../types/cms';
import { cmsApi } from '../../services/api';
import { useToast } from '../common/Toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface CmsTestimonialsManagerProps {
  onRefresh: () => void;
}

export const CmsTestimonialsManager: React.FC<CmsTestimonialsManagerProps> = ({ onRefresh }) => {
  const { showToast } = useToast();
  const [editingItem, setEditingItem] = useState<Partial<TestimonialItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const testimonials = cmsApi.getTestimonials(true);

  const handleOpenAdd = () => {
    setEditingItem({
      clientName: '',
      role: 'Engineering Lead',
      company: '',
      quote: '',
      projectWorkedOn: 'Custom CMS Platform',
      outcomeMetric: '',
      rating: 5,
      displayOrder: testimonials.length + 1,
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: TestimonialItem) => {
    setEditingItem({ ...t });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete testimonial from "${name}"?`)) {
      cmsApi.deleteTestimonial(id);
      showToast(`Deleted testimonial via DELETE /api/testimonials/${id}`);
      onRefresh();
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.clientName || !editingItem?.quote) {
      showToast('Client name and quote are required', 'error');
      return;
    }
    cmsApi.saveTestimonial(editingItem as any);
    showToast(editingItem.id ? 'Testimonial updated' : 'Testimonial created');
    setIsModalOpen(false);
    setEditingItem(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Client Testimonials</h2>
          <p className="text-xs text-neutral-400 font-mono">REST Content API: /api/testimonials</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="space-y-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span className="text-neutral-100 font-bold">{t.clientName}</span>
                <span>·</span>
                <span>{t.role}, {t.company}</span>
              </div>
              <p className="text-xs text-neutral-300 italic mt-1 max-w-xl">
                "{t.quote}"
              </p>
              {t.outcomeMetric && (
                <div className="text-[11px] font-mono text-emerald-400 mt-1">
                  Metric: {t.outcomeMetric}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenEdit(t)}
                className="p-2 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(t.id, t.clientName)}
                className="p-2 rounded bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-neutral-100 mb-4">
              {editingItem.id ? 'Edit Testimonial' : 'Add Testimonial'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.clientName || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Company</label>
                  <input
                    type="text"
                    value={editingItem.company || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Role / Designation</label>
                <input
                  type="text"
                  value={editingItem.role || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Quote *</label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.quote || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Concrete Outcome Metric</label>
                <input
                  type="text"
                  value={editingItem.outcomeMetric || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, outcomeMetric: e.target.value })}
                  placeholder="e.g. 64% latency reduction"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs"
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
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
