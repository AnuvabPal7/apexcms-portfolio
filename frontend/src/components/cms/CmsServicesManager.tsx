import React, { useState } from 'react';
import { ServiceItem } from '../../types/cms';
import { cmsApi } from '../../services/api';
import { useToast } from '../common/Toast';
import { Plus, Edit2, Trash2, Check } from 'lucide-react';

interface CmsServicesManagerProps {
  onRefresh: () => void;
}

export const CmsServicesManager: React.FC<CmsServicesManagerProps> = ({ onRefresh }) => {
  const { showToast } = useToast();
  const [editingSrv, setEditingSrv] = useState<Partial<ServiceItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const services = cmsApi.getServices(true);

  const handleOpenAdd = () => {
    setEditingSrv({
      number: `0${services.length + 1}`,
      title: '',
      description: '',
      deliverables: ['Custom architecture', 'Documentation'],
      technologies: ['Spring Boot', 'React'],
      displayOrder: services.length + 1,
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: ServiceItem) => {
    setEditingSrv({ ...srv });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete service "${title}"?`)) {
      cmsApi.deleteService(id);
      showToast(`Service deleted via DELETE /api/services/${id}`);
      onRefresh();
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSrv?.title || !editingSrv?.description) {
      showToast('Title and description required', 'error');
      return;
    }
    const payload = {
      ...editingSrv,
      deliverables: Array.isArray(editingSrv.deliverables)
        ? editingSrv.deliverables
        : String(editingSrv.deliverables || '').split('\n').map(s => s.trim()).filter(Boolean),
      technologies: Array.isArray(editingSrv.technologies)
        ? editingSrv.technologies
        : String(editingSrv.technologies || '').split(',').map(s => s.trim()).filter(Boolean),
    } as any;

    cmsApi.saveService(payload);
    showToast(editingSrv.id ? 'Service updated' : 'Service created');
    setIsModalOpen(false);
    setEditingSrv(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Service Offerings</h2>
          <p className="text-xs text-neutral-400 font-mono">REST Content API: /api/services</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between"
          >
            <div>
              <div className="text-amber-400 font-mono font-bold text-lg mb-1">{srv.number}.</div>
              <h3 className="text-base font-bold text-neutral-100">{srv.title}</h3>
              <p className="text-xs text-neutral-400 mt-1 mb-3">{srv.description}</p>
              <div className="space-y-1 mb-4">
                {srv.deliverables.map((d, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                    <Check className="w-3 h-3 text-amber-400" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-800/60">
              <span className="text-[11px] font-mono text-neutral-500">Order: {srv.displayOrder}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(srv)}
                  className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(srv.id, srv.title)}
                  className="p-1.5 rounded bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingSrv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-neutral-100 mb-4">
              {editingSrv.id ? 'Edit Service' : 'Add New Service'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Number</label>
                  <input
                    type="text"
                    value={editingSrv.number || '01'}
                    onChange={(e) => setEditingSrv({ ...editingSrv, number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs font-mono"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={editingSrv.title || ''}
                    onChange={(e) => setEditingSrv({ ...editingSrv, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingSrv.description || ''}
                  onChange={(e) => setEditingSrv({ ...editingSrv, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Deliverables (one per line)</label>
                <textarea
                  rows={3}
                  value={Array.isArray(editingSrv.deliverables) ? editingSrv.deliverables.join('\n') : editingSrv.deliverables || ''}
                  onChange={(e) => setEditingSrv({ ...editingSrv, deliverables: e.target.value.split('\n') })}
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
