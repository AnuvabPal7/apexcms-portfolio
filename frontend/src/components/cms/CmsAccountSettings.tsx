import React, { useState } from 'react';
import { cmsApi } from '../../services/api';
import { useToast } from '../common/Toast';

const inputClass =
  'w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400';
const labelClass = 'block text-xs font-medium text-neutral-300 mb-1';

export const CmsAccountSettings: React.FC = () => {
  const { showToast } = useToast();
  const user = cmsApi.getAuthUser();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword && newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    setSaving(true);
    const res = await cmsApi.updateAccount({
      currentPassword,
      name: name.trim(),
      email: email.trim(),
      newPassword: newPassword || undefined,
    });
    setSaving(false);
    if (res.success) {
      showToast('Account updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(res.error || 'Could not update account.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-xl">
      <div>
        <h2 className="text-2xl font-bold text-neutral-100">Account Settings</h2>
        <p className="text-xs text-neutral-400 font-mono">PUT /api/auth/account</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs">{error}</div>
        )}

        <div>
          <label className={labelClass}>Display Name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
        </div>

        <div>
          <label className={labelClass}>Login Email</label>
          <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>New Password (optional)</label>
            <input
              type="password"
              className={inputClass}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={10}
              maxLength={72}
              autoComplete="new-password"
              placeholder="10-72 characters"
            />
          </div>
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <input
              type="password"
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-800">
          <label className={labelClass}>Current Password (required to save any change)</label>
          <input
            type="password"
            required
            className={inputClass}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 text-sm font-semibold transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};
