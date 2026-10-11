'use client';

import React from 'react';
import { Activity, ShieldCheck, Zap, Lock, CheckCircle2 } from 'lucide-react';

export const MetricCards: React.FC = () => {
  const cards = [
    {
      title: 'Auth Health & Uptime',
      value: '99.94%',
      subtext: '+0.12% vs last month',
      subtextClass: 'text-emerald-700 font-semibold',
      icon: Activity,
      tag: 'Optimal',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Real-Time Verification Speed',
      value: '28 ms',
      subtext: 'Keystroke diff latency',
      subtextClass: 'text-slate-500',
      icon: Zap,
      tag: 'Ultra-Fast',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Character Accuracy Rate',
      value: '96.8%',
      subtext: 'First-attempt character match',
      subtextClass: 'text-slate-500',
      icon: CheckCircle2,
      tag: 'High Precision',
      tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      title: 'Identity Shield Score',
      value: '98 / 100',
      subtext: 'Zero leaked credential flags',
      subtextClass: 'text-emerald-700 font-semibold',
      icon: ShieldCheck,
      tag: 'Enterprise Tier',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 tracking-tight">
                {card.title}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${card.tagColor}`}
              >
                {card.tag}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {card.value}
                </div>
                <div className={`text-xs mt-1 ${card.subtextClass}`}>
                  {card.subtext}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-100">
                <Icon className="w-5 h-5 text-slate-700" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
