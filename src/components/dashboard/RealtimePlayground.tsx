'use client';

import React, { useState } from 'react';
import { RealtimePasswordInput } from '../auth/RealtimePasswordInput';
import { comparePassword, evaluateStrength } from '@/lib/password-checker';
import { Sparkles, Terminal, RefreshCw, CheckCircle, HelpCircle } from 'lucide-react';

export const RealtimePlayground: React.FC = () => {
  const [targetPassword, setTargetPassword] = useState('SecurePass2026!');
  const [typedInput, setTypedInput] = useState('securepass');

  const comparison = comparePassword(typedInput, targetPassword);
  const strength = evaluateStrength(typedInput);

  const presets = [
    { label: 'Case Sensitivity Test', target: 'AlphaBetaGamma!', input: 'alphabeta' },
    { label: 'High Security Token', target: 'K9#mQ8$vL2@z', input: 'K9#mQ' },
    { label: 'Wordle Style Shift', target: 'CyberShield99', input: 'ShieldCyber' },
    { label: 'Standard Pass', target: 'P@ssword123', input: 'Password' },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Verification Lab</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Real-Time Character Matching Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Test the live keystroke comparison algorithm against any expected target sequence.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-1">Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setTargetPassword(p.target);
                setTypedInput(p.input);
              }}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
        {/* Left Column: Target Configuration */}
        <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-xl p-4.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Expected Target Password
            </label>
            <span className="text-[11px] text-slate-400">Baseline for comparison</span>
          </div>

          <input
            type="text"
            value={targetPassword}
            onChange={(e) => setTargetPassword(e.target.value)}
            placeholder="Type target password here"
            className="w-full h-11 px-3.5 text-sm font-mono font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Target Length: <strong className="text-slate-700">{targetPassword.length}</strong> chars</span>
            <span>Policy: <strong className="text-emerald-700">Enforced</strong></span>
          </div>
        </div>

        {/* Right Column: Live Testing Input */}
        <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-xl p-4.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              2. User Live Input (Type to test)
            </label>
            <button
              type="button"
              onClick={() => setTypedInput('')}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Clear input
            </button>
          </div>

          {/* Real-time input with the screenshot UI */}
          <RealtimePasswordInput
            value={typedInput}
            onChange={setTypedInput}
            targetPassword={targetPassword}
            label=""
            placeholder="Type here to inspect live pills"
            showHelperTip={false}
          />
        </div>
      </div>

      {/* Detailed Keystroke Analysis Table */}
      <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-100/75 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            <span>Character Diagnostic Matrix</span>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {comparison.matchCount} / {Math.max(comparison.expectedLength, comparison.totalEntered)} characters verified
          </span>
        </div>

        {comparison.characters.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            Type characters into the test box above to display live byte-by-byte comparison telemetry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-slate-200">
                  <th className="py-2 px-3">Position</th>
                  <th className="py-2 px-3">Entered Char</th>
                  <th className="py-2 px-3">Expected Char</th>
                  <th className="py-2 px-3">Verification State</th>
                  <th className="py-2 px-3">Diagnosis Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {comparison.characters.map((char, index) => {
                  return (
                    <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-600">
                        #{index + 1}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {char.char}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">
                        {char.expectedChar || '—'}
                      </td>
                      <td className="py-2.5 px-3">
                        {char.status === 'correct' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            Exact Match
                          </span>
                        )}
                        {char.status === 'partial' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            Partial Match
                          </span>
                        )}
                        {char.status === 'wrong' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            Mismatch
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium capitalize">
                        {char.reason === 'exact'
                          ? 'Identical character'
                          : char.reason === 'wrong-case'
                          ? 'Case mismatch (A vs a)'
                          : char.reason === 'wrong-position'
                          ? 'Character exists elsewhere'
                          : 'Wrong character'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
