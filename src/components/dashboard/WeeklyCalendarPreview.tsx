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

  // Oct 12 - Oct 19, 2026 week definition matching reference
  const days = [
    { dayName: 'Mon', dayNum: 12, dateStr: '2026-10-12' },
    { dayName: 'Tue', dayNum: 13, dateStr: '2026-10-13' },
    { dayName: 'Wed', dayNum: 14, dateStr: '2026-10-14' },
    { dayName: 'Thu', dayNum: 16, dateStr: '2026-10-16' }, // anchored today
    { dayName: 'Fri', dayNum: 17, dateStr: '2026-10-17' },
    { dayName: 'Sat', dayNum: 18, dateStr: '2026-10-18' },
    { dayName: 'Sun', dayNum: 19, dateStr: '2026-10-19' },
  ];

  const getTasksForDate = (dateStr: string, dayNum: number): CalendarPreviewItem[] => {
    const liveTasks = tasks.filter((t) => t.dueDate === dateStr);
    if (liveTasks.length > 0) {
      return liveTasks.map((t) => ({
        id: t.id,
        title: t.title.length > 14 ? t.title.slice(0, 14) + '...' : t.title,
        time: t.dueTime || '10:00',
        color: 'bg-[#1c1c1c] text-neutral-200 border-[#2b2b2b]',
        rawTask: t,
      }));
    }

    // Reference image visual preview items per day (all grayscale)
    switch (dayNum) {
      case 12:
        return [
          { id: 'p-1', title: 'Fix LSSC', time: '10:00', color: 'bg-[#1a1a1a] text-neutral-300 border-[#262626]' },
          { id: 'p-2', title: 'Gym', time: '18:00', color: 'bg-[#1a1a1a] text-neutral-300 border-[#262626]' },
        ];
      case 13:
        return [
          { id: 'p-3', title: 'Job search', time: '10:00', color: 'bg-[#1a1a1a] text-neutral-300 border-[#262626]' },
          { id: 'p-4', title: 'Resume', time: '14:00', color: 'bg-[#1a1a1a] text-neutral-300 border-[#262626]' },
        ];
      case 14:
        return [
          { id: 'p-5', title: 'Interview', time: '11:30', color: 'bg-[#1a1a1a] text-neutral-300 border-[#262626]' },
          { id: 'p-6', title: 'Weazel News', time: '16:00', color: 'bg-[#1a1a1a] text-neutral-300 border-[#262626]' },
        ];
      case 16:
        return [
          { id: 'p-7', title: 'Genesis', time: '10:00', color: 'bg-[#1f1f1f] text-neutral-200 border-[#2e2e2e]' },
          { id: 'p-8', title: 'Content', time: '15:00', color: 'bg-[#1f1f1f] text-neutral-200 border-[#2e2e2e]' },
        ];
      case 17:
        return [
          { id: 'p-9', title: 'Follow up', time: '10:00', color: 'bg-[#1a1a1a] text-neutral-300 border-[#262626]' },
          { id: 'p-10', title: 'Review', time: '16:30', color: 'bg-[#1a1a1a] text-neutral-300 border-[#262626]' },
        ];
      case 19:
        return [
          { id: 'p-11', title: 'Plan week', time: '19:00', color: 'bg-[#1a1a1a] text-neutral-300 border-[#262626]' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="rounded-2xl bg-[#111111] border border-[#222222] p-4 md:p-5 shadow-md space-y-4">
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-bold text-white">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>This Week</span>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs font-medium text-neutral-500">Oct 2026</span>
        </div>

        <button
          onClick={onOpenFullCalendar}
          className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
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
                  ? 'bg-[#161616] border-[#383838] shadow-sm'
                  : 'bg-[#0d0d0d] border-[#1e1e1e] hover:border-[#2a2a2a]'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-neutral-500">{d.dayName}</span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isToday ? 'bg-white text-black shadow-sm' : 'text-neutral-400'
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
                    className={`px-1.5 py-1 rounded-md text-[10px] font-medium border truncate leading-tight transition-all ${item.color}`}
                    title={`${item.title} (${item.time})`}
                  >
                    <div className="truncate font-semibold text-neutral-200">{item.title}</div>
                    <div className="text-[9px] text-neutral-500">{item.time}</div>
                  </div>
                ))}

                {isToday && dayCards.length >= 2 && (
                  <div className="text-[9px] font-bold text-center text-neutral-400 bg-[#1c1c1c] rounded py-0.5 border border-[#2b2b2b]">
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
