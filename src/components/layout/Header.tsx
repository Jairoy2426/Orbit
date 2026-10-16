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
  Sun,
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
  searchQuery,
  onSearchChange,
  tasks,
  jobs,
  onToggleMobileSidebar,
  onSelectTask,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const todayStr = getTodayDateString();

  const overdueTasks = tasks.filter(
    (t) => t.status !== 'done' && t.status !== 'cancelled' && t.dueDate && t.dueDate < todayStr
  );
  const followUpsDue = jobs.filter((j) => j.status === 'follow_up_due' || j.nextFollowUpDate === todayStr);

  const totalAlerts = overdueTasks.length + followUpsDue.length;

  return (
    <header className="h-16 border-b border-[#1f1f1f] bg-[#090909]/95 backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4 select-none">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-[#181818]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1 group">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks, projects, applications, notes..."
            className="w-full bg-[#111111] border border-[#222222] rounded-xl pl-10 pr-16 py-2 text-xs md:text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <kbd className="text-[10px] bg-[#1a1a1a] text-neutral-400 border border-[#2a2a2a] px-1.5 py-0.5 rounded font-mono">
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span className="hidden sm:inline">Capture</span>
        </button>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-[#111111] border border-[#222222] text-neutral-400 hover:text-white hover:border-neutral-500 transition-all"
            title="Notifications & Alerts"
          >
            <Bell className="w-4 h-4" />
            {totalAlerts > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white ring-2 ring-[#111111]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#111111] border border-[#282828] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#1f1f1f]">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-neutral-400" />
                  Notifications & Urgencies
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#222222] text-white font-semibold">
                  {totalAlerts} Alert{totalAlerts !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {overdueTasks.length === 0 && followUpsDue.length === 0 && (
                  <div className="py-6 text-center text-xs text-neutral-500">
                    <CheckCircle2 className="w-7 h-7 text-neutral-400 mx-auto mb-2 opacity-80" />
                    All tasks and follow-ups are up to date.
                  </div>
                )}

                {overdueTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onSelectTask?.(t);
                      setShowNotifications(false);
                    }}
                    className="p-2.5 rounded-xl bg-[#181818] border border-[#2a2a2a] hover:border-neutral-400 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-neutral-200 text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Overdue Task</span>
                    </div>
                    <p className="text-xs text-neutral-100 mt-1 font-medium truncate">{t.title}</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Due {t.dueDate}</p>
                  </div>
                ))}

                {followUpsDue.map((j) => (
                  <div
                    key={j.id}
                    className="p-2.5 rounded-xl bg-[#181818] border border-[#2a2a2a] hover:border-neutral-400 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-neutral-200 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Recruiter Follow-up Due</span>
                    </div>
                    <p className="text-xs text-neutral-100 mt-1 font-medium">
                      {j.company} — {j.role}
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      Contact: {j.recruiterName || 'Team'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Monochromatic Status/Sun Icon */}
        <div className="hidden sm:flex p-2 rounded-xl bg-[#111111] border border-[#222222] text-neutral-400">
          <Sun className="w-4 h-4" />
        </div>

        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111111] border border-[#222222] text-xs font-medium text-neutral-300">
          <CalendarIcon className="w-3.5 h-3.5 text-neutral-400" />
          <span>{formatFullDate(todayStr)}</span>
        </div>
      </div>
    </header>
  );
}
