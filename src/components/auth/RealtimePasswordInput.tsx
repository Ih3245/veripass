'use client';

import React, { useState, useId } from 'react';
import { Eye, EyeOff, ArrowRight, Check, X, ShieldCheck, Flame, Info } from 'lucide-react';
import { comparePassword } from '@/lib/password-checker';

interface RealtimePasswordInputProps {
  value: string;
  onChange: (val: string) => void;
  targetPassword?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showHelperTip?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export const RealtimePasswordInput: React.FC<RealtimePasswordInputProps> = ({
  value,
  onChange,
  targetPassword = '',
  label = 'Enter your password to proceed',
  placeholder = '••••••••••••',
  required = true,
  disabled = false,
  showHelperTip = true,
  className = '',
  autoFocus = false,
}) => {
  const [showPlaintext, setShowPlaintext] = useState(false);
  const inputId = useId();

  // Run the character-by-character comparison
  const comparison = comparePassword(value, targetPassword);

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {/* Label matching screenshot font & style */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 select-none"
        >
          {label}
        </label>
      )}

      {/* Input container with the signature blue border from the screenshot */}
      <div className="relative group">
        <input
          id={inputId}
          type={showPlaintext ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete="current-password"
          className="w-full h-13 px-4.5 pr-12 text-lg sm:text-xl font-medium tracking-wide text-slate-900 bg-white border-2 border-blue-600 rounded-lg shadow-sm outline-none transition-all duration-150 focus:border-blue-700 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:border-slate-300 placeholder:text-slate-400 placeholder:tracking-widest"
        />

        {/* Visibility Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPlaintext((prev) => !prev)}
          tabIndex={-1}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          title={showPlaintext ? 'Hide password' : 'Show password'}
        >
          {showPlaintext ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* The Signature Real-Time Feedback Pill Row from Screenshot */}
      <div className="pt-1.5">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Black circle with right arrow (exact icon from screenshot) */}
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm shrink-0 transition-transform active:scale-95"
            title="Real-time verification sequence"
          >
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </div>

          {/* Feedback Pills for each typed character */}
          {comparison.characters.map((item, idx) => {
            const isCorrect = item.status === 'correct';
            const isPartial = item.status === 'partial';
            const isWrong = item.status === 'wrong';

            return (
              <div
                key={idx}
                className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white shadow-sm transition-all duration-200 transform scale-100 animate-in fade-in zoom-in-75 ${
                  isCorrect
                    ? 'bg-emerald-600 ring-2 ring-emerald-500/30'
                    : isPartial
                    ? 'bg-amber-500 ring-2 ring-amber-400/30'
                    : 'bg-red-600 ring-2 ring-red-500/30'
                }`}
                title={
                  isCorrect
                    ? `Position ${idx + 1}: Exact match!`
                    : isPartial
                    ? `Position ${idx + 1}: Near match (${item.reason === 'wrong-case' ? 'wrong case' : 'character present elsewhere'})`
                    : `Position ${idx + 1}: Incorrect character`
                }
              >
                {isCorrect && <Check className="w-4 h-4 stroke-[3.5]" />}
                {isPartial && (
                  <div className="relative flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                    {idx === comparison.characters.length - 1 && (
                      <Flame className="w-3 h-3 absolute -top-2.5 -right-2 text-orange-400 animate-pulse" />
                    )}
                  </div>
                )}
                {isWrong && <X className="w-4 h-4 stroke-[3.5]" />}
              </div>
            );
          })}

          {/* Empty placeholders if user hasn't typed yet */}
          {value.length === 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium pl-1">
              <span>Type password to check characters live</span>
            </div>
          )}
        </div>

        {/* Real-time stats & helper bar */}
        {value.length > 0 && targetPassword && (
          <div className="mt-2.5 flex flex-wrap items-center justify-between text-xs font-medium text-slate-500 border-t border-slate-100 pt-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">
                {comparison.matchCount} of {Math.max(comparison.expectedLength, comparison.totalEntered)} characters matched
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
              <span
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                  comparison.isExactMatch
                    ? 'bg-emerald-100 text-emerald-800'
                    : comparison.accuracyPercentage > 60
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {comparison.accuracyPercentage}% accuracy
              </span>
            </div>

            {comparison.isExactMatch && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1 animate-pulse">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Password Verified
              </span>
            )}
          </div>
        )}

        {/* Legend / Tooltip explanation */}
        {showHelperTip && value.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 bg-slate-50 border border-slate-200/80 rounded-md px-2.5 py-1.5">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <strong className="text-slate-700">Green:</strong> Correct
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <strong className="text-slate-700">Orange:</strong> Wrong case or position
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
              <strong className="text-slate-700">Red:</strong> Incorrect
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
