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
      count: overdueCount,
      title: 'Overdue',
      subtitle: 'Needs attention',
      icon: AlertTriangle,
      color: 'text-rose-400',
      bgGlow: 'hover:border-rose-500/40 bg-rose-500/5',
      iconBg: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
      action: () => onFilterClick?.('overdue'),
    },
    {
      id: 'today',
      count: todayCount,
      title: 'Today',
      subtitle: 'Across all areas',
      icon: Calendar,
      color: 'text-blue-400',
      bgGlow: 'hover:border-blue-500/40 bg-blue-500/5',
      iconBg: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
      action: () => onFilterClick?.('today'),
    },
    {
      id: 'followups',
      count: followUpsCount,
      title: 'Follow-ups',
      subtitle: 'Job applications',
      icon: Send,
      color: 'text-emerald-400',
      bgGlow: 'hover:border-emerald-500/40 bg-emerald-500/5',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      action: () => onFilterClick?.('followups'),
    },
    {
      id: 'projects',
      count: activeProjectsCount,
      title: 'Projects Active',
      subtitle: 'In progress',
      icon: FolderKanban,
      color: 'text-purple-400',
      bgGlow: 'hover:border-purple-500/40 bg-purple-500/5',
      iconBg: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
      action: () => onFilterClick?.('projects'),
    },
    {
      id: 'tasks',
      count: totalTasksCount,
      title: 'Total Tasks',
      subtitle: 'This week',
      icon: BarChart2,
      color: 'text-violet-400',
      bgGlow: 'hover:border-violet-500/40 bg-violet-500/5',
      iconBg: 'bg-violet-500/15 text-violet-400 border border-violet-500/30',
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
            className={`p-4 rounded-xl border border-[#1b263e] bg-[#0d1322] ${c.bgGlow} transition-all cursor-pointer group flex items-start justify-between`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-black ${c.color} tracking-tight`}>
                  {c.count}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-200 mt-1">{c.title}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{c.subtitle}</p>
            </div>

            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.iconBg}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
