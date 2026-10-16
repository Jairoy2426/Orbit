'use client';

import React, { useState } from 'react';
import {
  Check,
  MoreHorizontal,
  Briefcase,
  FileText,
  Monitor,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Target,
  Info,
} from 'lucide-react';
import { Task, Project, JobApplication } from '@/types';
import { formatFriendlyDate, getTodayDateString } from '@/lib/date-utils';

interface TodaysPrioritiesProps {
  tasks: Task[];
  projects: Project[];
  jobs: JobApplication[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeferTask: (id: string) => void;
  onViewAllTasks: () => void;
}

export function TodaysPriorities({
  tasks,
  projects,
  jobs,
  onToggleTask,
  onEditTask,
  onDeferTask,
  onViewAllTasks,
}: TodaysPrioritiesProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const todayStr = getTodayDateString();

  // Find priority recommended tasks
  const priorityTasks = tasks
    .filter((t) => t.status !== 'done' && t.status !== 'cancelled')
    .slice(0, 6);

  const getTaskContext = (task: Task) => {
    if (task.careerApplicationId) {
      const job = jobs.find((j) => j.id === task.careerApplicationId);
      return {
        label: `Job Application • ${job ? job.company : 'Career'}`,
        icon: Briefcase,
      };
    }
    if (task.projectId) {
      const proj = projects.find((p) => p.id === task.projectId);
      return {
        label: `Project • ${proj ? proj.name : 'Development'}`,
        icon: Monitor,
      };
    }
    if (task.tags.includes('career') || task.tags.includes('search')) {
      return {
        label: 'Job Search • Active opportunities',
        icon: Search,
      };
    }
    return {
      label: 'Personal • Needed for upcoming applications',
      icon: FileText,
    };
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'bg-white text-black font-bold border-white';
      case 'medium':
        return 'bg-[#262626] text-neutral-200 border-[#383838]';
      case 'low':
      default:
        return 'bg-[#181818] text-neutral-400 border-[#262626]';
    }
  };

  const getDueDateBadge = (dueDate?: string) => {
    if (!dueDate) return null;
    const isOverdue = dueDate < todayStr;
    const isToday = dueDate === todayStr;

    if (isOverdue) {
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1c1c1c] text-neutral-300 border border-[#2e2e2e]">
          <Calendar className="w-3 h-3 text-neutral-400" />
          Overdue
        </span>
      );
    }
    if (isToday) {
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1c1c1c] text-neutral-300 border border-[#2e2e2e]">
          Today
        </span>
      );
    }
    return (
      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#161616] text-neutral-400 border border-[#262626]">
        {formatFriendlyDate(dueDate)}
      </span>
    );
  };

  return (
    <div className="rounded-2xl bg-[#111111] border border-[#222222] p-4 md:p-5 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] text-white flex items-center justify-center border border-[#2a2a2a]">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Today&apos;s Priorities</h2>
            <p className="text-[11px] text-neutral-400 font-medium">
              Recommended based on deadlines, importance and your goals.
            </p>
          </div>
        </div>

        <button
          onClick={onViewAllTasks}
          className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Priorities List */}
      <div className="space-y-2.5">
        {priorityTasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            <CheckCircle2 className="w-7 h-7 text-neutral-400 mx-auto mb-2 opacity-80" />
            No pending tasks left for today!
          </div>
        ) : (
          priorityTasks.map((task) => {
            const context = getTaskContext(task);
            const ContextIcon = context.icon;
            const isDone = task.status === 'done';

            return (
              <div
                key={task.id}
                className="group relative flex items-center justify-between p-3 md:p-3.5 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] hover:border-[#333333] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Checkbox */}
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                      isDone
                        ? 'bg-white border-white text-black'
                        : 'border-[#383838] hover:border-white bg-[#141414]'
                    }`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  {/* Context Icon */}
                  <div className="w-8 h-8 rounded-lg bg-[#181818] border border-[#262626] text-neutral-300 flex items-center justify-center shrink-0 hidden sm:flex">
                    <ContextIcon className="w-4 h-4" />
                  </div>

                  {/* Title & Context */}
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span
                        onClick={() => onEditTask(task)}
                        className={`text-xs md:text-sm font-semibold truncate cursor-pointer hover:text-white transition-colors ${
                          isDone ? 'line-through text-neutral-600' : 'text-neutral-100'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[11px] text-neutral-400 truncate font-medium">
                        {context.label}
                      </span>
                      {task.estimatedEffortHours && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-neutral-500 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          {task.estimatedEffortHours}h
                        </span>
                      )}
                      {task.recommendationReason && (
                        <span
                          title={task.recommendationReason}
                          className="hidden md:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded bg-[#181818] text-neutral-300 border border-[#2a2a2a] truncate max-w-[200px]"
                        >
                          <Info className="w-2.5 h-2.5 shrink-0" />
                          {task.recommendationReason}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Badges & Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {getDueDateBadge(task.dueDate)}

                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${getPriorityBadge(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>

                  {/* Action Menu (...) */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
                      className="p-1 rounded-lg text-neutral-500 hover:text-white hover:bg-[#1a1a1a] transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {activeMenuId === task.id && (
                      <div className="absolute right-0 mt-1 w-36 rounded-xl bg-[#141414] border border-[#2c2c2c] shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                        <button
                          onClick={() => {
                            onEditTask(task);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-neutral-200 hover:bg-[#222222] transition-colors"
                        >
                          Edit details
                        </button>
                        <button
                          onClick={() => {
                            onDeferTask(task.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-neutral-200 hover:bg-[#222222] transition-colors"
                        >
                          Defer to tomorrow
                        </button>
                        <button
                          onClick={() => {
                            onToggleTask(task.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-white hover:bg-[#222222] transition-colors font-medium"
                        >
                          {isDone ? 'Mark as incomplete' : 'Mark as completed'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
