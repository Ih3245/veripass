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
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    setUsers(getUsers());
    setCurrentUser(getCurrentSession());
    setLogs(getAuditLogs());
  }, []);

  const handleLoginSuccess = (user: User) => {
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, lastLogin: 'Just now' } : u
    );
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    setCurrentUser(user);
    setCurrentSession(user);
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal Top Nav */}
      <header className="border-b border-slate-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-sm tracking-tight">VeriPass</span>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setAuthMode('login')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign up
            </button>
          </nav>
        </div>
      </header>

      {/* Main — centered form only */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
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
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-100 py-4 px-6 text-center">
        <p className="text-xs text-slate-400">
          © 2026 VeriPass · Real-time character verification engine
        </p>
      </footer>
    </div>
  );
}
