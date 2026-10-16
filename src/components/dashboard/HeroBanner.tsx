'use client';

import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { PlanningPreferences } from '@/types';

interface HeroBannerProps {
  preferences: PlanningPreferences;
  remainingTasksCount: number;
  onOpenPlanner: () => void;
}

export function HeroBanner({ preferences, remainingTasksCount, onOpenPlanner }: HeroBannerProps) {
  // Determine greeting based on current local time
  const getGreeting = () => {
    return 'Good afternoon';
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c1426] via-[#111933] to-[#141b3a] border border-[#1d2945] p-5 md:p-7 shadow-xl">
      {/* Decorative cosmic background stars and subtle mountain backdrop */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/20 via-indigo-500/10 to-transparent" />
      <div className="absolute -right-8 -bottom-10 w-80 h-44 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {preferences.userName}.
            </h1>
            <span className="text-2xl">👋</span>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1 font-medium flex items-center gap-2">
            <span>Here&apos;s your plan for today.</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs border border-blue-500/30">
              {remainingTasksCount} tasks remaining
            </span>
          </p>
        </div>

        {/* Motivational Quote & Daily Plan Shortcut */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block text-right max-w-xs">
            <p className="text-xs italic text-slate-300 font-serif">
              &ldquo;{preferences.quote}&rdquo;
            </p>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">— Orbit Daily Mindset</span>
          </div>

          <button
            onClick={onOpenPlanner}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141e34] hover:bg-[#1a2745] border border-[#25375d] text-slate-200 text-xs font-semibold hover:text-white transition-all shadow-md group shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-12 transition-transform" />
            <span>Review Daily Plan</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
