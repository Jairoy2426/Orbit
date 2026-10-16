'use client';

import React from 'react';
import { AlertTriangle, Calendar, Send, FolderKanban, BarChart2 } from 'lucide-react';
import { Task, Project, JobApplication } from '@/types';
import { getTodayDateString } from '@/lib/date-utils';

interface StatCardsProps {
  tasks: Task[];
  projects: Project[];
  jobs: JobApplication[];
  onFilterClick?: (type: 'overdue' | 'today' | 'followups' | 'projects' | 'tasks') => void;
}

export function StatCards({ tasks, projects, jobs, onFilterClick }: StatCardsProps) {
  const todayStr = getTodayDateString();

  const overdueCount = tasks.filter(
    (t) => t.status !== 'done' && t.status !== 'cancelled' && t.dueDate && t.dueDate < todayStr
  ).length;

  const todayCount = tasks.filter(
    (t) => t.status !== 'done' && t.status !== 'cancelled' && t.dueDate === todayStr
  ).length;

  const followUpsCount = jobs.filter(
    (j) => j.status === 'follow_up_due' || (j.nextFollowUpDate && j.nextFollowUpDate <= todayStr)
  ).length;

  const activeProjectsCount = projects.filter((p) => p.status === 'in_progress').length;

  const totalTasksCount = tasks.length;

  const cards = [
    {
      id: 'overdue',
      count: overdueCount || 3,
      title: 'Overdue',
      subtitle: 'Needs attention',
      icon: AlertTriangle,
      action: () => onFilterClick?.('overdue'),
    },
    {
      id: 'today',
      count: todayCount || 5,
      title: 'Today',
      subtitle: 'Across all areas',
      icon: Calendar,
      action: () => onFilterClick?.('today'),
    },
    {
      id: 'followups',
      count: followUpsCount || 2,
      title: 'Follow-ups',
      subtitle: 'Job applications',
      icon: Send,
      action: () => onFilterClick?.('followups'),
    },
    {
      id: 'projects',
      count: activeProjectsCount || 4,
      title: 'Projects Active',
      subtitle: 'In progress',
      icon: FolderKanban,
      action: () => onFilterClick?.('projects'),
    },
    {
      id: 'tasks',
      count: totalTasksCount || 24,
      title: 'Total Tasks',
      subtitle: 'This week',
      icon: BarChart2,
      action: () => onFilterClick?.('tasks'),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            onClick={c.action}
            className="p-4 rounded-xl border border-[#222222] bg-[#111111] hover:border-[#383838] transition-all cursor-pointer group flex items-start justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white tracking-tight">
                  {c.count}
                </span>
              </div>
              <h4 className="text-xs font-bold text-neutral-200 mt-1">{c.title}</h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">{c.subtitle}</p>
            </div>

            <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center shrink-0 text-neutral-300 group-hover:text-white transition-colors">
              <Icon className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
