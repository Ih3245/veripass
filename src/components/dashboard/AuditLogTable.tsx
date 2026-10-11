'use client';

import React, { useState } from 'react';
import { AuditLog } from '@/types/auth';
import { Search, Download, Filter, ShieldCheck, ShieldAlert, KeyRound } from 'lucide-react';

interface AuditLogTableProps {
  logs: AuditLog[];
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'danger'>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Timestamp', 'User', 'Email', 'Event', 'IP Address', 'Location', 'Device', 'Accuracy', 'Status'];
    const rows = filteredLogs.map((l) => [
      l.timestamp,
      l.userName,
      l.userEmail,
      l.eventType,
      l.ipAddress,
      l.location,
      l.device,
      `${l.accuracy}%`,
      l.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `veripass_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Security & Authentication Audit Trail
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable telemetry records of character-by-character auth attempts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by user or IP..."
              className="h-9 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-600 focus:bg-white transition-all w-48 sm:w-56"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="h-9 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="all">All Events</option>
            <option value="success">Success Only</option>
            <option value="danger">Failed Only</option>
          </select>

          {/* Export Button */}
          <button
            type="button"
            onClick={exportCSV}
            className="h-9 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-slate-200 uppercase tracking-wider">
              <th className="py-3 px-4">Event & Status</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Origin / Location</th>
              <th className="py-3 px-4">Device / Client</th>
              <th className="py-3 px-4">Accuracy</th>
              <th className="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No matching audit logs found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const isSuccess = log.status === 'success';
                const isWarning = log.status === 'warning';
                const isDanger = log.status === 'danger';

                return (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Event & Status */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {isSuccess && <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                        {isWarning && <KeyRound className="w-4 h-4 text-amber-500 shrink-0" />}
                        {isDanger && <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />}
                        <span
                          className={`font-semibold capitalize ${
                            isSuccess
                              ? 'text-emerald-900'
                              : isWarning
                              ? 'text-amber-900'
                              : 'text-red-900'
                          }`}
                        >
                          {log.eventType.replace('_', ' ')}
                        </span>
                      </div>
                    </td>

                    {/* User */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{log.userName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{log.userEmail}</div>
                    </td>

                    {/* Origin / Location */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{log.location}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{log.ipAddress}</div>
                    </td>

                    {/* Device / Client */}
                    <td className="py-3 px-4 text-slate-600">
                      {log.device}
                    </td>

                    {/* Accuracy */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          log.accuracy === 100
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.accuracy > 70
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.accuracy}%
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
