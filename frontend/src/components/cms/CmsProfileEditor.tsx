import React, { useState } from 'react';
import { ProfileContent } from '../../types/cms';
import { cmsApi } from '../../services/api';
import { useToast } from '../common/Toast';
import { Save, Image as ImageIcon } from 'lucide-react';

interface CmsProfileEditorProps {
  onRefresh: () => void;
}

export const CmsProfileEditor: React.FC<CmsProfileEditorProps> = ({ onRefresh }) => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<ProfileContent>(cmsApi.getProfile());
  const mediaList = cmsApi.getMedia();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    cmsApi.updateProfile(profile);
    showToast('Profile & About content updated via PUT /api/about');
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">About & Profile Settings</h2>
          <p className="text-xs text-neutral-400 font-mono">REST Content API: PUT /api/about</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-6">
        
        {/* Core Identifiers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Role Title
            </label>
            <input
              type="text"
              required
              value={profile.roleTitle}
              onChange={(e) => setProfile({ ...profile, roleTitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Hero Kicker & Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Hero Top Kicker
            </label>
            <input
              type="text"
              value={profile.heroKicker}
              onChange={(e) => setProfile({ ...profile, heroKicker: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Availability Status
            </label>
            <select
              value={profile.availability}
              onChange={(e) => setProfile({ ...profile, availability: e.target.value as any })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
            >
              <option value="Available for hire">Available for hire</option>
              <option value="Open to consulting">Open to consulting</option>
              <option value="Booked until Q3">Booked until Q3</option>
            </select>
          </div>
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Tagline (Headline Narrative)
          </label>
          <textarea
            rows={2}
            value={profile.tagline}
            onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
          />
        </div>

        {/* Profile photo (optional) */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-300 mb-1">
            <ImageIcon className="w-3.5 h-3.5" /> Profile Photo (optional)
          </label>
          <select
            value={profile.avatarUrl || ''}
            onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="">No photo (show initial)</option>
            {mediaList.map((m) => (
              <option key={m.id} value={m.url}>{m.name}</option>
            ))}
          </select>
          <p className="text-[11px] text-neutral-500 mt-1">Upload a photo in the Media tab first, then pick it here.</p>
        </div>

        {/* Bio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Primary Bio
            </label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Extended Narrative
            </label>
            <textarea
              rows={4}
              value={profile.extendedBio}
              onChange={(e) => setProfile({ ...profile, extendedBio: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>
        </div>

        {/* Contact & Socials */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              GitHub URL
            </label>
            <input
              type="text"
              value={profile.githubUrl}
              onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              LinkedIn URL
            </label>
            <input
              type="text"
              value={profile.linkedinUrl}
              onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Quant Stats */}
        <div className="pt-4 border-t border-neutral-800">
          <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
            Quantitative Metrics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Years Experience</label>
              <input
                type="number"
                value={profile.stats.yearsExperience}
                onChange={(e) => setProfile({ ...profile, stats: { ...profile.stats, yearsExperience: parseInt(e.target.value) || 0 } })}
                className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Shipped Projects</label>
              <input
                type="number"
                value={profile.stats.shippedProjects}
                onChange={(e) => setProfile({ ...profile, stats: { ...profile.stats, shippedProjects: parseInt(e.target.value) || 0 } })}
                className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">GitHub Contributions</label>
              <input
                type="number"
                value={profile.stats.githubContributions}
                onChange={(e) => setProfile({ ...profile, stats: { ...profile.stats, githubContributions: parseInt(e.target.value) || 0 } })}
                className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">CSAT Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={profile.stats.clientSatisfactionRate}
                onChange={(e) => setProfile({ ...profile, stats: { ...profile.stats, clientSatisfactionRate: parseFloat(e.target.value) || 0 } })}
                className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Persist Changes</span>
          </button>
        </div>

      </form>
    </div>
  );
};
