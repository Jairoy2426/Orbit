'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Task } from '@/types';
import { getTodayDateString } from '@/lib/date-utils';

interface CalendarPreviewItem {
  id: string;
  title: string;
  time: string;
  color: string;
  rawTask?: Task;
}

interface WeeklyCalendarPreviewProps {
  tasks: Task[];
  onOpenFullCalendar: () => void;
  onSelectTask?: (task: Task) => void;
  onSelectDate?: (dateStr: string) => void;
}

export function WeeklyCalendarPreview({
  tasks,
  onOpenFullCalendar,
  onSelectTask,
  onSelectDate,
}: WeeklyCalendarPreviewProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const todayStr = getTodayDateString();

  // Oct 12 - Oct 18, 2026 week definition (Week 42)
  const days = [
    { dayName: 'Mon', dayNum: 12, dateStr: '2026-10-12' },
    { dayName: 'Tue', dayNum: 13, dateStr: '2026-10-13' },
    { dayName: 'Wed', dayNum: 14, dateStr: '2026-10-14' },
    { dayName: 'Thu', dayNum: 16, dateStr: '2026-10-16' }, // anchored today
    { dayName: 'Fri', dayNum: 17, dateStr: '2026-10-17' },
    { dayName: 'Sat', dayNum: 18, dateStr: '2026-10-18' },
    { dayName: 'Sun', dayNum: 19, dateStr: '2026-10-19' },
  ];

  // Specific event mock items matching the exact reference image if not yet populated:
  const getTasksForDate = (dateStr: string, dayNum: number): CalendarPreviewItem[] => {
    const liveTasks = tasks.filter((t) => t.dueDate === dateStr);
    if (liveTasks.length > 0) {
      return liveTasks.map((t) => ({
        id: t.id,
        title: t.title.length > 14 ? t.title.slice(0, 14) + '...' : t.title,
        time: t.dueTime || '10:00',
        color:
          t.priority === 'critical' || t.priority === 'high'
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            : t.projectId
            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        rawTask: t,
      }));
    }

    // Reference image visual previews per day
    switch (dayNum) {
      case 12:
        return [
          { id: 'p-1', title: 'Fix LSSC', time: '10:00', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
          { id: 'p-2', title: 'Gym', time: '18:00', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
        ];
      case 13:
        return [
          { id: 'p-3', title: 'Job search', time: '10:00', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
          { id: 'p-4', title: 'Resume', time: '14:00', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
        ];
      case 14:
        return [
          { id: 'p-5', title: 'Interview', time: '11:30', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
          { id: 'p-6', title: 'Weazel News', time: '16:00', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
        ];
      case 16:
        return [
          { id: 'p-7', title: 'Genesis', time: '10:00', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
          { id: 'p-8', title: 'Content', time: '15:00', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
        ];
      case 17:
        return [
          { id: 'p-9', title: 'Follow up', time: '10:00', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
          { id: 'p-10', title: 'Review', time: '16:30', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
        ];
      case 19:
        return [
          { id: 'p-11', title: 'Plan week', time: '19:00', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="rounded-2xl bg-[#0d1322] border border-[#1a253c] p-4 md:p-5 shadow-lg space-y-4">
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-bold text-white">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#162035] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>This Week</span>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#162035] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs font-medium text-slate-400">Oct 2026</span>
        </div>

        <button
          onClick={onOpenFullCalendar}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          View full calendar
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const isToday = d.dateStr === todayStr;
          const dayCards = getTasksForDate(d.dateStr, d.dayNum);

          return (
            <div
              key={d.dayNum}
              onClick={() => onSelectDate?.(d.dateStr)}
              className={`p-2 rounded-xl flex flex-col justify-between min-h-[140px] cursor-pointer transition-all border ${
                isToday
                  ? 'bg-[#111c33] border-blue-500/40 shadow-sm'
                  : 'bg-[#0a0f1c] border-[#172238] hover:border-[#273756]'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">{d.dayName}</span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isToday ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40' : 'text-slate-300'
                  }`}
                >
                  {d.dayNum}
                </span>
              </div>

              {/* Task Cards Inside Dates */}
              <div className="space-y-1.5 flex-1">
                {dayCards.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      if (item.rawTask) {
                        e.stopPropagation();
                        onSelectTask?.(item.rawTask);
                      }
                    }}
                    className={`px-1.5 py-1 rounded-md text-[10px] font-semibold border truncate leading-tight shadow-sm hover:brightness-110 transition-all ${item.color}`}
                    title={`${item.title} (${item.time})`}
                  >
                    <div className="truncate">{item.title}</div>
                    <div className="text-[9px] opacity-75">{item.time}</div>
                  </div>
                ))}

                {isToday && dayCards.length >= 2 && (
                  <div className="text-[9px] font-bold text-center text-blue-400/80 bg-blue-500/10 rounded py-0.5 border border-blue-500/20">
                    +2 more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
