'use client';

import React, { useState, useEffect } from 'react';
import { User, AuditLog } from '@/types/auth';
import {
  INITIAL_USERS,
  INITIAL_LOGS,
  getUsers,
  saveUsers,
  getCurrentSession,
  setCurrentSession,
  getAuditLogs,
  addAuditLog,
} from '@/lib/auth-store';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Sync with persistent local storage after mounting
  useEffect(() => {
    const loadedUsers = getUsers();
    const session = getCurrentSession();
    const loadedLogs = getAuditLogs();

    setUsers(loadedUsers);
    setCurrentUser(session);
    setLogs(loadedLogs);
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentSession(user);

    // Update user's last login
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, lastLogin: 'Just now' } : u
    );
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    // Add audit log
    addAuditLog({
      userEmail: user.email,
      userName: user.name,
      eventType: 'login_success',
      ipAddress: '192.168.1.104',
      location: 'Dhaka, Bangladesh',
      device: 'Chrome 129 / Windows 11',
      accuracy: 100,
      status: 'success',
    });
    setLogs(getAuditLogs());
  };

  const handleFailedAttempt = (email: string) => {
    addAuditLog({
      userEmail: email,
      userName: email.split('@')[0] || 'Unknown',
      eventType: 'login_failed',
      ipAddress: '192.168.1.104',
      location: 'Dhaka, Bangladesh',
      device: 'Chrome 129 / Windows 11',
      accuracy: 45,
      status: 'danger',
    });
    setLogs(getAuditLogs());
  };

  const handleRegisterSuccess = (newUser: User) => {
    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    setCurrentUser(newUser);
    setCurrentSession(newUser);

    // Add audit log
    addAuditLog({
      userEmail: newUser.email,
      userName: newUser.name,
      eventType: 'user_created',
      ipAddress: '192.168.1.104',
      location: 'Dhaka, Bangladesh',
      device: 'Chrome 129 / Windows 11',
      accuracy: 100,
      status: 'success',
    });
    setLogs(getAuditLogs());
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentSession(null);
    setAuthMode('login');
  };

  const handleUpdatePassword = (newPass: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, passwordHash: newPass };
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));

    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    setCurrentUser(updatedUser);
    setCurrentSession(updatedUser);

    addAuditLog({
      userEmail: currentUser.email,
      userName: currentUser.name,
      eventType: 'password_changed',
      ipAddress: '192.168.1.104',
      location: 'Dhaka, Bangladesh',
      device: 'Chrome 129 / Windows 11',
      accuracy: 100,
      status: 'warning',
    });
    setLogs(getAuditLogs());
  };

  const handleSwitchUser = (targetUser: User) => {
    setCurrentUser(targetUser);
    setCurrentSession(targetUser);
  };

  // If user is logged in, show Dashboard
  if (currentUser) {
    return (
      <DashboardView
        currentUser={currentUser}
        users={users}
        logs={logs}
        onLogout={handleLogout}
        onUpdatePassword={handleUpdatePassword}
        onSwitchUser={handleSwitchUser}
        onNavigateToRegister={() => {
          handleLogout();
          setAuthMode('register');
        }}
      />
    );
  }

  // Auth Screen (Login or Register)
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      {/* Top minimal bar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xs py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-2xs">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <span className="font-bold text-slate-900 text-base tracking-tight">VeriPass</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Real-Time Keystroke Auth
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAuthMode('login')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                authMode === 'login'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                authMode === 'register'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
        {/* Left Side: Product Details & Visual Proof */}
        <div className="max-w-xl text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wide">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Live Keystroke Validation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Password verification that reacts as you type.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            No more waiting to submit and guessing which character failed.
            Our real-time engine validates each keystroke instantly with animated checkmarks, crosses, and near-match feedback.
          </p>

          {/* Feature Highlights (Strictly Clean & Professional, No Glassmorphism) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Green Checkmark (✓)</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Immediate confirmation of the exact correct character in position.
              </p>
            </div>

            <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Orange / Amber (✓)</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Near match alert (casing discrepancy or misplaced letter).
              </p>
            </div>

            <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Red Cross (✕)</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Instant identification of incorrect keystrokes before submission.
              </p>
            </div>

            <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-slate-900" />
                <span>Telemetry Dashboard</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Full enterprise overview, user directory, audit trail, and password lab.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form (Login or Register) */}
        <div className="w-full max-w-lg flex justify-center">
          {authMode === 'login' ? (
            <LoginForm
              users={users}
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setAuthMode('register')}
              onFailedAttempt={handleFailedAttempt}
            />
          ) : (
            <RegisterForm
              onRegisterSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setAuthMode('login')}
            />
          )}
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VeriPass Identity Suite • Vercel Ready</span>
          <span className="text-slate-400">Strictly clean professional styling — No dark/blue AI glassmorphism</span>
        </div>
      </footer>
    </div>
  );
}
