'use client';

import React, { useState } from 'react';
import { User } from '@/types/auth';
import { RealtimePasswordInput } from '../auth/RealtimePasswordInput';
import { Shield, Key, Laptop, Smartphone, CheckCircle2, Lock } from 'lucide-react';

interface UserProfileCardProps {
  user: User;
  onUpdatePassword: (newPassword: string) => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  onUpdatePassword,
}) => {
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (currentPassInput !== user.passwordHash) {
      setErrorMsg('Current password does not match.');
      return;
    }

    if (newPassInput.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    onUpdatePassword(newPassInput);
    setSuccessMsg('Password updated successfully!');
    setIsChangingPass(false);
    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        {/* User Avatar & Basic Info */}
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">{user.role} • {user.department}</p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Change Password Trigger Button */}
        <button
          type="button"
          onClick={() => setIsChangingPass((prev) => !prev)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Key className="w-3.5 h-3.5" />
          {isChangingPass ? 'Close Password Form' : 'Change Master Password'}
        </button>
      </div>

      {successMsg && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Change Password Form (Incorporating the Real-Time Verifier) */}
      {isChangingPass && (
        <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            Update Security Credentials
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Verify your existing password and choose a new passphrase with real-time character matching.
          </p>

          {errorMsg && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSavePassword} className="space-y-4">
            {/* Step 1: Verify current password */}
            <RealtimePasswordInput
              value={currentPassInput}
              onChange={setCurrentPassInput}
              targetPassword={user.passwordHash}
              label="Enter current password to verify"
              placeholder="Current password"
              required
            />

            {/* Step 2: New password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Passphrase
              </label>
              <input
                type="password"
                required
                value={newPassInput}
                onChange={(e) => setNewPassInput(e.target.value)}
                placeholder="Choose a strong new password"
                className="w-full h-10 px-3 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            {/* Step 3: Realtime confirmation of new password */}
            {newPassInput.length > 0 && (
              <RealtimePasswordInput
                value={confirmPassInput}
                onChange={setConfirmPassInput}
                targetPassword={newPassInput}
                label="Confirm new passphrase (Real-time check)"
                placeholder="Re-type new passphrase"
                required
              />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsChangingPass(false)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={currentPassInput !== user.passwordHash || newPassInput !== confirmPassInput || !newPassInput}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
              >
                Save New Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Biometric & MFA Status</span>
          </div>
          <div className="text-sm font-semibold text-slate-900 mt-1">Hardware Key Ready</div>
          <div className="text-xs text-slate-500 mt-0.5">FIDO2 WebAuthn Passkey configured</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
            <Laptop className="w-4 h-4 text-blue-600" />
            <span>Primary Workstation</span>
          </div>
          <div className="text-sm font-semibold text-slate-900 mt-1">Active (Current Tab)</div>
          <div className="text-xs text-slate-500 mt-0.5">TLS 1.3 • AES-256 encrypted tunnel</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            <span>Mobile Authenticator</span>
          </div>
          <div className="text-sm font-semibold text-slate-900 mt-1">Synced & Verified</div>
          <div className="text-xs text-slate-500 mt-0.5">Push notifications enabled</div>
        </div>
      </div>
    </div>
  );
};
