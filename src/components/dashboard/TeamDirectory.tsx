'use client';

import React from 'react';
import { User } from '@/types/auth';
import { Users, UserCheck, Shield, KeyRound } from 'lucide-react';

interface TeamDirectoryProps {
  users: User[];
  currentUserId: string;
  onSwitchUser: (user: User) => void;
}

export const TeamDirectory: React.FC<TeamDirectoryProps> = ({
  users,
  currentUserId,
  onSwitchUser,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Provisioned Users Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            All enterprise accounts configured with real-time passkeys and credentials.
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {users.length} Total Users
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {users.map((user) => {
          const isCurrent = user.id === currentUserId;
          return (
            <div
              key={user.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">
                      {user.name}
                    </span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        Current Session
                      </span>
                    )}
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {user.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mt-0.5">
                    {user.role} • <span className="text-slate-400">{user.department}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="hidden sm:block text-right">
                  <div className="text-[11px] text-slate-400">Created: {user.createdAt}</div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center justify-end gap-1">
                    <KeyRound className="w-3 h-3 text-slate-400" />
                    <span>Pass: {user.passwordHash}</span>
                  </div>
                </div>

                {!isCurrent && (
                  <button
                    type="button"
                    onClick={() => onSwitchUser(user)}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                  >
                    Switch to Account
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
