'use client';

import React, { useState } from 'react';
import { User } from '@/types/auth';
import { RealtimePasswordInput } from './RealtimePasswordInput';
import { evaluateStrength } from '@/lib/password-checker';
import { UserPlus, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegisterFormProps {
  onRegisterSuccess: (newUser: User) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess,
  onSwitchToLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Security Operations Analyst');
  const [department, setDepartment] = useState('Cybersecurity');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = evaluateStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify character indicators below.');
      return;
    }

    setIsSubmitting(true);

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role.trim() || 'Team Member',
      department: department.trim() || 'Engineering',
      avatar: `https://images.unsplash.com/photo-${1535713875002 + (Date.now() % 1000)}?auto=format&fit=crop&w=256&h=256&q=80`,
      passwordHash: password,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Just now',
      status: 'active',
    };

    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onRegisterSuccess(newUser);
    }, 450);
  };

  const isConfirmed = password.length > 0 && password === confirmPassword;

  return (
    <div className="w-full max-w-lg bg-white border border-slate-200/90 rounded-2xl shadow-xl p-6 sm:p-8 transition-all">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Create user account
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Set up credentials with real-time biometric and policy verification.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full h-10 px-3 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Role / Designation
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. DevOps Engineer"
              className="w-full h-10 px-3 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>
        </div>

        {/* Corporate Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Work Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane.doe@company.com"
            className="w-full h-10 px-3 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        {/* Set Master Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Create Master Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            className="w-full h-11 px-3.5 text-sm font-medium text-slate-900 bg-white border-2 border-slate-300 rounded-lg shadow-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />

          {/* Password Strength Gauge */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1.5 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Security Strength:</span>
                <span
                  className={`font-bold ${
                    strength.score >= 75
                      ? 'text-emerald-600'
                      : strength.score >= 50
                      ? 'text-blue-600'
                      : 'text-amber-600'
                  }`}
                >
                  {strength.level} ({strength.score}/100)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    strength.score >= 75
                      ? 'bg-emerald-500'
                      : strength.score >= 50
                      ? 'bg-blue-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.max(5, strength.score)}%` }}
                />
              </div>

              {/* Real-time Checklist Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: '8+ chars', met: strength.hasMinLength },
                  { label: 'Uppercase', met: strength.hasUppercase },
                  { label: 'Lowercase', met: strength.hasLowercase },
                  { label: 'Number', met: strength.hasNumber },
                  { label: 'Special char', met: strength.hasSpecialChar },
                ].map((item, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      item.met
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200/60 text-slate-500'
                    }`}
                  >
                    {item.met && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Real-Time Password Confirmation Checker */}
        {password.length > 0 && (
          <div className="pt-2">
            <RealtimePasswordInput
              value={confirmPassword}
              onChange={setConfirmPassword}
              targetPassword={password}
              label="Confirm password (Live Verification)"
              placeholder="Re-type password to verify"
              required
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !isConfirmed || !name || !email}
          className={`w-full h-12 rounded-lg font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-3 ${
            isConfirmed
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
              : 'bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-60 disabled:cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating profile...
            </span>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Create Account & Enter Dashboard</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to Sign In */}
      <div className="mt-5 pt-4 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-600">
          Already registered?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            Sign in to existing account
          </button>
        </p>
      </div>
    </div>
  );
};
