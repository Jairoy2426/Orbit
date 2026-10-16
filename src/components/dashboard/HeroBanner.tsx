'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PlanningPreferences } from '@/types';

interface HeroBannerProps {
  preferences: PlanningPreferences;
  remainingTasksCount: number;
  onOpenPlanner: () => void;
}

export function HeroBanner({ preferences, remainingTasksCount, onOpenPlanner }: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d0d0d] via-[#121212] to-[#171717] border border-[#222222] p-5 md:p-7 shadow-lg">
      {/* Monochrome Lunar Landscape Graphic Backdrop */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/30 via-neutral-500/10 to-transparent" />
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      {/* Subtle Moon / Horizon Crescent Silhouette */}
      <div className="absolute right-12 bottom-0 w-72 h-16 rounded-t-full bg-neutral-900/40 border-t border-neutral-700/20 blur-sm pointer-events-none hidden md:block" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Good afternoon, {preferences.userName || 'Jai'}.
            </h1>
            <span className="text-2xl">👋</span>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 mt-1 font-medium flex items-center gap-2">
            <span>Here&apos;s your plan for today.</span>
            <span className="px-2 py-0.5 rounded-full bg-[#1e1e1e] text-neutral-200 font-semibold text-xs border border-[#333333]">
              {remainingTasksCount} tasks remaining
            </span>
          </p>
        </div>

        {/* Motivational Quote & Daily Plan Shortcut */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:block text-right max-w-xs">
            <p className="text-xs italic text-neutral-300 font-serif">
              &ldquo;{preferences.quote}&rdquo;
            </p>
            <span className="text-[10px] text-neutral-500 font-mono tracking-wider">— Orbit Daily Mindset</span>
          </div>

          <button
            onClick={onOpenPlanner}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-[#333333] text-neutral-200 text-xs font-semibold hover:text-white transition-all shadow-sm group shrink-0"
          >
            <span>Review Plan</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
