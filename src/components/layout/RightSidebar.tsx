'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Task, JobApplication } from '@/types';
import { getTodayDateString } from '@/lib/date-utils';

interface RightSidebarProps {
  tasks: Task[];
  jobs: JobApplication[];
  onOpenCalendar: () => void;
  onSelectDate?: (dateStr: string) => void;
  selectedDate?: string;
}

export function RightSidebar({
  tasks,
  jobs,
  onOpenCalendar,
  onSelectDate,
  selectedDate = getTodayDateString(),
}: RightSidebarProps) {
  const [currentMonthIndex] = useState(9); // Oct (0-indexed 9)
  const daysInOct = 31;

  // Map dates with tasks
  const tasksByDate = new Map<number, number>();
  tasks.forEach((t) => {
    if (t.dueDate?.startsWith('2026-10-')) {
      const day = parseInt(t.dueDate.split('-')[2], 10);
      tasksByDate.set(day, (tasksByDate.get(day) || 0) + 1);
    }
  });

  // Upcoming items curated from tasks and job interviews
  const upcomingEvents = [
    {
      id: 'up-1',
      date: '16',
      month: 'Oct',
      title: 'Follow up — TechCorp',
      category: 'Job Application',
      time: '10:00 - 11:00',
    },
    {
      id: 'up-2',
      date: '17',
      month: 'Oct',
      title: 'Interview — Nova Systems',
      category: 'Interview',
      time: '11:00 - 12:00',
    },
    {
      id: 'up-3',
      date: '18',
      month: 'Oct',
      title: 'Job search session',
      category: 'Recurring Habit',
      time: '10:00 - 11:00',
    },
    {
      id: 'up-4',
      date: '20',
      month: 'Oct',
      title: 'Genesis — Client review',
      category: 'Project Milestone',
      time: '16:00 - 17:00',
    },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-80 border-l border-[#1f1f1f] bg-[#090909] p-4 space-y-6 shrink-0 select-none overflow-y-auto">
      {/* Monthly Mini Calendar Widget */}
      <div className="p-4 rounded-2xl bg-[#111111] border border-[#222222]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-white" />
            <h3 className="text-xs font-bold text-white tracking-wide">Calendar</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-300">Oct 2026</span>
            <div className="flex items-center gap-0.5">
              <button className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#1f1f1f] transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#1f1f1f] transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Day Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-neutral-500 mb-2">
          <span>S</span>
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {/* Previous month padding (4 days for Thu start) */}
          {[28, 29, 30].map((d) => (
            <div key={`prev-${d}`} className="py-1 text-neutral-700 text-[11px]">
              {d}
            </div>
          ))}

          {/* October days */}
          {Array.from({ length: daysInOct }, (_, i) => i + 1).map((day) => {
            const isToday = day === 16;
            const dayStr = `2026-10-${day.toString().padStart(2, '0')}`;
            const isSelected = selectedDate === dayStr;
            const hasTasks = tasksByDate.has(day);

            return (
              <button
                key={day}
                onClick={() => onSelectDate?.(dayStr)}
                className={`relative py-1 rounded-lg text-[11px] font-medium transition-all flex flex-col items-center justify-center ${
                  isToday
                    ? 'bg-white text-black font-bold shadow-md'
                    : isSelected
                    ? 'bg-[#222222] text-white border border-[#444444]'
                    : 'text-neutral-400 hover:bg-[#1c1c1c] hover:text-white'
                }`}
              >
                <span>{day}</span>
                {hasTasks && !isToday && (
                  <span className="w-1 h-1 rounded-full bg-neutral-400 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming Section */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white flex items-center gap-2 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-white inline-block" />
            Upcoming
          </h3>
          <button
            onClick={onOpenCalendar}
            className="text-[11px] font-semibold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-xl bg-[#111111] border border-[#222222] border-l-4 border-l-white hover:border-[#383838] transition-all group flex items-start gap-3"
            >
              {/* Date Block */}
              <div className="text-center shrink-0 w-8">
                <span className="text-sm font-bold text-white block leading-tight">{evt.date}</span>
                <span className="text-[10px] text-neutral-500 uppercase font-semibold">{evt.month}</span>
              </div>

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-neutral-100 truncate group-hover:text-white transition-colors">
                  {evt.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium text-neutral-300 bg-[#1f1f1f] border border-[#2b2b2b]">
                    {evt.category}
                  </span>
                  <span className="text-[10px] text-neutral-500">{evt.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
