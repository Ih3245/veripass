'use client';

import React from 'react';
import { User } from '@/types/auth';
import { KeyRound, Sparkles } from 'lucide-react';

interface DemoAccountPickerProps {
  users: User[];
  onSelect: (user: User) => void;
  selectedEmail?: string;
}

export const DemoAccountPicker: React.FC<DemoAccountPickerProps> = ({
  users,
  onSelect,
  selectedEmail,
}) => {
  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Quick Demo Accounts</span>
        </div>
        <span className="text-[11px] text-slate-400">Click to autofill</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {users.slice(0, 3).map((user) => {
          const isSelected = selectedEmail === user.email;
          return (
            <button
              key={user.id}
              type="button"
              onClick={() => onSelect(user)}
              className={`text-left p-2 rounded-md border transition-all text-xs cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
              }`}
            >
              <div className="font-semibold text-slate-800 truncate">{user.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{user.role}</div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-600 font-mono font-medium">
                <KeyRound className="w-3 h-3 shrink-0" />
                <span className="truncate">{user.passwordHash}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
