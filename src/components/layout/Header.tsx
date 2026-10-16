'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Calendar as CalendarIcon,
  Menu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatFullDate, getTodayDateString } from '@/lib/date-utils';
import { Task, JobApplication } from '@/types';

interface HeaderProps {
  onOpenQuickCapture: () => void;
  onOpenSearch: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  tasks: Task[];
  jobs: JobApplication[];
  onToggleMobileSidebar: () => void;
  onSelectTask?: (task: Task) => void;
}

export function Header({
  onOpenQuickCapture,
  onOpenSearch,
  searchQuery,
  onSearchChange,
  tasks,
  jobs,
  onToggleMobileSidebar,
  onSelectTask,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const todayStr = getTodayDateString();

  // Find notifications: overdue tasks, follow-ups due today, interviews today/tomorrow
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'done' && t.status !== 'cancelled' && t.dueDate && t.dueDate < todayStr
  );
  const followUpsDue = jobs.filter((j) => j.status === 'follow_up_due' || j.nextFollowUpDate === todayStr);

  const totalAlerts = overdueTasks.length + followUpsDue.length;

  return (
    <header className="h-16 border-b border-[#1a253c] bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#131d33]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1 group">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks, projects, applications, notes..."
            className="w-full bg-[#0d1322] border border-[#1e2a44] rounded-xl pl-10 pr-16 py-2 text-xs md:text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <kbd className="text-[10px] bg-[#162035] text-slate-400 border border-[#23314f] px-1.5 py-0.5 rounded font-mono">
              Ctrl K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Capture Button */}
        <button
          onClick={onOpenQuickCapture}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span className="hidden sm:inline">Quick Capture</span>
        </button>

        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1322] border border-[#1e2a44] text-xs font-medium text-slate-300">
          <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>{formatFullDate(todayStr)}</span>
        </div>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-[#0d1322] border border-[#1e2a44] text-slate-400 hover:text-white hover:border-[#2a3c61] transition-all"
            title="Notifications & Alerts"
          >
            <Bell className="w-4 h-4" />
            {totalAlerts > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0d1322] animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0f172a] border border-[#23314f] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#1f2d48]">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Notifications & Urgencies
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold">
                  {totalAlerts} New
                </span>
              </div>

              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {overdueTasks.length === 0 && followUpsDue.length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                    All tasks and follow-ups are up to date!
                  </div>
                )}

                {overdueTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onSelectTask?.(t);
                      setShowNotifications(false);
                    }}
                    className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Overdue Task</span>
                    </div>
                    <p className="text-xs text-slate-200 mt-1 font-medium truncate">{t.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Due {t.dueDate}</p>
                  </div>
                ))}

                {followUpsDue.map((j) => (
                  <div
                    key={j.id}
                    className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Recruiter Follow-up Due</span>
                    </div>
                    <p className="text-xs text-slate-200 mt-1 font-medium">
                      {j.company} — {j.role}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Recruiter: {j.recruiterName || 'Contact team'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
