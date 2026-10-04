import React, { useState } from 'react';
import { MediaAsset } from '../../types/cms';
import { cmsApi } from '../../services/api';
import { useToast } from '../common/Toast';
import { Upload, Copy, Trash2, Check } from 'lucide-react';

interface CmsMediaLibraryProps {
  onRefresh: () => void;
}

export const CmsMediaLibrary: React.FC<CmsMediaLibraryProps> = ({ onRefresh }) => {
  const { showToast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [, setIsUploading] = useState(false);

  const mediaList = cmsApi.getMedia();

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    showToast(`URL copied: ${asset.name}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove asset "${name}" from media storage?`)) {
      cmsApi.deleteMedia(id);
      showToast(`Asset deleted via DELETE /api/media/${id}`);
      onRefresh();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    cmsApi.uploadImage(file)
      .then(() => showToast(`File "${file.name}" uploaded via POST /api/upload/image`))
      .catch((err: Error) => showToast(`Upload failed: ${err.message}`))
      .finally(() => {
        setIsUploading(false);
        e.target.value = '';
        onRefresh();
      });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Media Storage & Assets</h2>
          <p className="text-xs text-neutral-400 font-mono">REST Media API: POST /api/upload/image</p>
        </div>

        {/* Upload Control */}
        <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto">
          <Upload className="w-4 h-4" />
          <span>Upload Image File</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Grid of Media Assets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mediaList.map((asset) => (
          <div
            key={asset.id}
            className="group flex flex-col justify-between rounded-2xl bg-neutral-900/50 border border-neutral-800/80 overflow-hidden hover:border-neutral-700 transition-colors"
          >
            {/* Image Preview */}
            <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden">
              <img
                src={asset.url}
                alt={asset.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute top-2 right-2 text-[10px] font-mono text-neutral-400 bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800">
                {asset.size}
              </div>
            </div>

            {/* Asset Metadata */}
            <div className="p-4 space-y-2">
              <div className="font-mono text-xs text-neutral-200 font-bold truncate" title={asset.name}>
                {asset.name}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>{asset.mimeType}</span>
                <span>{asset.uploadedAt}</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-neutral-800/60">
                <button
                  onClick={() => handleCopyUrl(asset)}
                  className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors flex items-center gap-1"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(asset.id, asset.name)}
                  className="p-1 rounded bg-neutral-800 hover:bg-red-950 text-neutral-500 hover:text-red-400 transition-colors"
                  title="Delete asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
