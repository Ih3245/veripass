'use client';

import React from 'react';
import { User } from '@/types/auth';
import { ShieldCheck, LogOut, Bell, Sparkles } from 'lucide-react';

interface DashboardHeaderProps {
  currentUser: User;
  onLogout: () => void;
  activeTab: 'overview' | 'playground' | 'audit' | 'users';
  onTabChange: (tab: 'overview' | 'playground' | 'audit' | 'users') => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentUser,
  onLogout,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-base tracking-tight">
                  VeriPass
                </span>
                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                  Live Auth
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'playground', label: 'Password Lab' },
                { id: 'audit', label: 'Audit Trail' },
                { id: 'users', label: 'Directory' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id as typeof activeTab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-slate-100 text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
            </button>

            {/* User Dropdown / Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-900 truncate max-w-[130px]">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate max-w-[130px]">
                  {currentUser.role}
                </div>
              </div>

              {/* Sign out button */}
              <button
                type="button"
                onClick={onLogout}
                className="ml-1 p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                title="Sign out of account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'playground', label: 'Password Lab' },
            { id: 'audit', label: 'Audit Trail' },
            { id: 'users', label: 'Directory' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as typeof activeTab)}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
