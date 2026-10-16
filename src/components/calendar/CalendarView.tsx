'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Clock,
  Briefcase,
  FolderKanban,
  CheckCircle2,
} from 'lucide-react';
import { Task, JobApplication, Project } from '@/types';
import { getTodayDateString } from '@/lib/date-utils';

interface CalendarViewProps {
  tasks: Task[];
  jobs: JobApplication[];
  projects: Project[];
  onOpenTaskModal: (task?: Task) => void;
  onSelectDateToCreateTask?: (dateStr: string) => void;
}

type ViewMode = 'month' | 'week' | 'day';

export function CalendarView({
  tasks,
  jobs,
  projects,
  onOpenTaskModal,
  onSelectDateToCreateTask,
}: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentYear] = useState(2026);
  const [currentMonthIndex] = useState(9); // Oct 2026
  const [selectedDay, setSelectedDay] = useState<number>(16);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'project' | 'career' | 'routine'>('all');

  const todayStr = getTodayDateString();
  const daysInMonth = 31;
  const startDayOfWeek = 4; // Oct 1, 2026 starts on Thursday (index 4)

  // Map events to date string
  const getEventsForDate = (dateStr: string) => {
    const dayTasks = tasks.filter((t) => {
      if (t.dueDate !== dateStr) return false;
      if (categoryFilter === 'project' && !t.projectId) return false;
      if (categoryFilter === 'career' && !t.careerApplicationId && !t.tags.includes('career')) return false;
      if (categoryFilter === 'routine' && !t.isRecurring) return false;
      return true;
    });

    const dayJobs = jobs.filter((j) => {
      if (categoryFilter === 'project') return false;
      if (categoryFilter === 'routine') return false;
      return j.nextFollowUpDate === dateStr || (j.interviewDate && j.interviewDate.startsWith(dateStr));
    });

    return { dayTasks, dayJobs };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Calendar Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Schedule & Calendar</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize deadlines, job follow-ups, and recurring habits on a unified timeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Navigation Controls */}
          <div className="flex items-center bg-[#0d1322] border border-[#1a253c] p-1 rounded-xl">
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#162035] transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-white tracking-wide">
              October 2026
            </span>
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#162035] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Today Button */}
          <button
            onClick={() => setSelectedDay(16)}
            className="px-3 py-1.5 rounded-xl bg-[#0d1322] border border-[#1a253c] text-xs font-semibold text-blue-400 hover:text-white hover:border-blue-500/50 transition-colors"
          >
            Today
          </button>

          {/* New Task Button */}
          <button
            onClick={() => onOpenTaskModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Schedule Task</span>
          </button>
        </div>
      </div>

      {/* View Switcher & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#0d1322] border border-[#1a253c]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'month'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#162035]'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'week'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#162035]'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'day'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#162035]'
            }`}
          >
            Day
          </button>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              categoryFilter === 'all'
                ? 'bg-[#1e2a44] text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Categories
          </button>
          <button
            onClick={() => setCategoryFilter('project')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              categoryFilter === 'project'
                ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setCategoryFilter('career')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              categoryFilter === 'career'
                ? 'bg-purple-600/20 text-purple-400 font-bold border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Career & Interviews
          </button>
          <button
            onClick={() => setCategoryFilter('routine')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              categoryFilter === 'routine'
                ? 'bg-emerald-600/20 text-emerald-400 font-bold border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Habits & Routines
          </button>
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="rounded-2xl bg-[#0d1322] border border-[#1a253c] p-4 shadow-lg overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 pb-3 border-b border-[#151f33]">
            <span>Sunday</span>
            <span>Monday</span>
            <span>Tuesday</span>
            <span>Wednesday</span>
            <span>Thursday</span>
            <span>Friday</span>
            <span>Saturday</span>
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-2 pt-3">
            {/* Prior month fillers */}
            {[27, 28, 29, 30].map((d) => (
              <div
                key={`prior-${d}`}
                className="min-h-[105px] p-2 rounded-xl bg-[#080d17]/50 border border-[#121a2c] text-slate-600 text-xs select-none"
              >
                <span>{d}</span>
              </div>
            ))}

            {/* Days 1 to 31 */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dateStr = `2026-10-${day.toString().padStart(2, '0')}`;
              const isToday = day === 16;
              const isSelected = selectedDay === day;
              const { dayTasks, dayJobs } = getEventsForDate(dateStr);

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[105px] p-2 rounded-xl border flex flex-col justify-between transition-all cursor-pointer group ${
                    isToday
                      ? 'bg-[#111c33] border-blue-500/40 shadow-md'
                      : isSelected
                      ? 'bg-[#0f172a] border-blue-400/50'
                      : 'bg-[#0a0f1c] border-[#162137] hover:border-[#273756]'
                  }`}
                >
                  {/* Day number header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isToday ? 'bg-blue-600 text-white' : 'text-slate-300'
                      }`}
                    >
                      {day}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDateToCreateTask?.(dateStr);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-white transition-opacity"
                      title="Add task on this date"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Event cards inside day cell */}
                  <div className="space-y-1 flex-1 overflow-y-auto max-h-[75px]">
                    {/* Job interviews or followups */}
                    {dayJobs.map((j) => (
                      <div
                        key={j.id}
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 truncate"
                        title={`${j.company} — ${j.status.replace('_', ' ')}`}
                      >
                        💼 {j.company}
                      </div>
                    ))}

                    {/* Tasks */}
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenTaskModal(t);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border truncate transition-all ${
                          t.status === 'done'
                            ? 'bg-slate-800/50 text-slate-500 line-through border-slate-700/50'
                            : t.priority === 'critical' || t.priority === 'high'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : t.projectId
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        }`}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Day Agenda Drawer */}
      <div className="p-4 rounded-2xl bg-[#0d1322] border border-[#1a253c] shadow-lg space-y-3">
        <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-blue-400" />
          Agenda for 2026-10-{selectedDay.toString().padStart(2, '0')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(() => {
            const dateStr = `2026-10-${selectedDay.toString().padStart(2, '0')}`;
            const { dayTasks, dayJobs } = getEventsForDate(dateStr);

            if (dayTasks.length === 0 && dayJobs.length === 0) {
              return (
                <p className="text-xs text-slate-500 py-3 col-span-2">
                  No scheduled tasks or interviews on this day.
                </p>
              );
            }

            return (
              <>
                {dayJobs.map((j) => (
                  <div
                    key={j.id}
                    className="p-3 rounded-xl bg-[#0a0f1c] border border-purple-500/30 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-purple-400 block">
                        Career Activity
                      </span>
                      <h4 className="text-xs font-bold text-white mt-0.5">
                        {j.company} — {j.role}
                      </h4>
                      <p className="text-[10px] text-slate-400">{j.interviewStage || 'Follow-up'}</p>
                    </div>
                    <span className="text-xs font-mono text-purple-300">{j.interviewDate || 'All Day'}</span>
                  </div>
                ))}

                {dayTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onOpenTaskModal(t)}
                    className="p-3 rounded-xl bg-[#0a0f1c] border border-[#172238] hover:border-blue-500/40 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-blue-400 block">
                        {t.projectId ? 'Project Task' : 'Personal Task'}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-0.5">{t.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {t.dueTime || 'No time specified'} • {t.estimatedEffortHours}h effort
                      </p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {t.priority}
                    </span>
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
