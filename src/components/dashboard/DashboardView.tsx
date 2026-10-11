'use client';

import React, { useState } from 'react';
import { User, AuditLog } from '@/types/auth';
import { DashboardHeader } from './DashboardHeader';
import { MetricCards } from './MetricCards';
import { RealtimePlayground } from './RealtimePlayground';
import { UserProfileCard } from './UserProfileCard';
import { AuditLogTable } from './AuditLogTable';
import { TeamDirectory } from './TeamDirectory';
import { ShieldCheck, Plus, ArrowUpRight, Zap, RefreshCw } from 'lucide-react';

interface DashboardViewProps {
  currentUser: User;
  users: User[];
  logs: AuditLog[];
  onLogout: () => void;
  onUpdatePassword: (newPass: string) => void;
  onSwitchUser: (user: User) => void;
  onNavigateToRegister: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  users,
  logs,
  onLogout,
  onUpdatePassword,
  onSwitchUser,
  onNavigateToRegister,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'playground' | 'audit' | 'users'>('overview');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Header */}
      <DashboardHeader
        currentUser={currentUser}
        onLogout={onLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 space-y-7">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 border-b border-slate-200/60 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Welcome, {currentUser.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Verified
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Active security session for <strong className="text-slate-700">{currentUser.email}</strong>. Keystroke telemetry active.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab('playground')}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Open Password Lab</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToRegister}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New User</span>
            </button>
          </div>
        </div>

        {/* Tab-based rendering */}
        {activeTab === 'overview' && (
          <div className="space-y-7">
            {/* 1. Telemetry Metrics */}
            <MetricCards />

            {/* 2. Interactive Real-Time Password Testing Lab */}
            <RealtimePlayground />

            {/* 3. User Profile Card */}
            <UserProfileCard
              user={currentUser}
              onUpdatePassword={onUpdatePassword}
            />

            {/* 4. Recent Security Audit Log */}
            <AuditLogTable logs={logs} />
          </div>
        )}

        {activeTab === 'playground' && (
          <div className="space-y-6">
            <RealtimePlayground />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6">
            <AuditLogTable logs={logs} />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <TeamDirectory
              users={users}
              currentUserId={currentUser.id}
              onSwitchUser={onSwitchUser}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 VeriPass Live Authentication Portal. Production build ready for GitHub & Vercel.</p>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span>Real-Time Keystroke Engine</span>
            <span>•</span>
            <span>Zero Glassmorphism Clean Design</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
