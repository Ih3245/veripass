'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { RealtimePasswordInput } from './RealtimePasswordInput';
import { DemoAccountPicker } from './DemoAccountPicker';
import { LogIn, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginFormProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
  onSwitchToRegister: () => void;
  onFailedAttempt?: (email: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  users,
  onLoginSuccess,
  onSwitchToRegister,
  onFailedAttempt,
}) => {
  const [email, setEmail] = useState('alex.morgan@company.com');
  const [password, setPassword] = useState('');
  const [targetPassword, setTargetPassword] = useState('Secure2026!');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When email changes, update the target password dynamically
  useEffect(() => {
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (matchedUser) {
      setTargetPassword(matchedUser.passwordHash);
    } else {
      // If user not found, target is empty so checks show standard mismatch
      setTargetPassword('');
    }
    setErrorMessage('');
  }, [email, users]);

  const handleSelectDemo = (user: User) => {
    setEmail(user.email);
    setPassword('');
    setTargetPassword(user.passwordHash);
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      setErrorMessage('Account not found with this email address.');
      setIsSubmitting(false);
      onFailedAttempt?.(email);
      return;
    }

    if (password !== user.passwordHash) {
      setErrorMessage('Password does not match. Please verify character indicators above.');
      setIsSubmitting(false);
      onFailedAttempt?.(email);
      return;
    }

    // Success confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // fallback if canvas not available
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(user);
    }, 400);
  };

  const isPasswordReady = password.length > 0 && password === targetPassword;

  return (
    <div className="w-full max-w-lg bg-white border border-slate-200/90 rounded-2xl shadow-xl p-6 sm:p-8 transition-all">
      {/* Brand Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Sign in to access your secure enterprise telemetry dashboard.
        </p>
      </div>

      {/* Demo Account Quick Autofill */}
      <div className="mb-6">
        <DemoAccountPicker
          users={users}
          onSelect={handleSelectDemo}
          selectedEmail={email}
        />
      </div>

      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Authentication Notice</p>
            <p className="text-xs text-red-600 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Address */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Email or Corporate ID
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@company.com"
            className="w-full h-11 px-3.5 text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg shadow-xs focus:border-blue-600 focus:ring-3 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Real-time Password Input (Matching Screenshot exactly) */}
        <RealtimePasswordInput
          value={password}
          onChange={setPassword}
          targetPassword={targetPassword}
          label="Enter your password to proceed"
          placeholder="••••••••••••"
          required
        />

        {/* Action Row */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Keep me signed in for 30 days
          </label>
          <button
            type="button"
            onClick={() => {
              if (targetPassword) setPassword(targetPassword);
            }}
            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors cursor-pointer"
          >
            Autofill correct pass
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full h-12 rounded-lg font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
            isPasswordReady
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          } active:scale-[0.99] disabled:opacity-70`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying credentials...
            </span>
          ) : isPasswordReady ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Password Match 100% — Proceed</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In to Dashboard</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to Create User */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-600">
          Need a new user profile?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            Create new account
          </button>
        </p>
      </div>
    </div>
  );
};
