'use client';

import React from 'react';
import { BarChart3, ArrowRight, CheckCircle2, Briefcase, FolderKanban, Bell } from 'lucide-react';
import { Task, JobApplication } from '@/types';

interface ProgressStatsProps {
  tasks: Task[];
  jobs: JobApplication[];
  onViewAnalytics: () => void;
}

export function ProgressStats({ tasks, jobs, onViewAnalytics }: ProgressStatsProps) {
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const totalTasks = Math.max(tasks.length, 20);

  const appliedJobs = jobs.filter((j) => j.status !== 'interested' && j.status !== 'to_apply').length;
  const targetJobs = 10;

  const projectTasksDone = tasks.filter((t) => t.projectId && t.status === 'done').length;
  const totalProjectTasks = Math.max(tasks.filter((t) => t.projectId).length, 12);

  const followUpsCompleted = 3;
  const targetFollowUps = 5;

  const metrics = [
    {
      id: 'tasks',
      label: 'Tasks completed',
      current: completedTasks || 12,
      target: 20,
      icon: CheckCircle2,
    },
    {
      id: 'jobs',
      label: 'Job applications',
      current: appliedJobs || 4,
      target: targetJobs,
      icon: Briefcase,
    },
    {
      id: 'projects',
      label: 'Project tasks',
      current: projectTasksDone || 6,
      target: totalProjectTasks,
      icon: FolderKanban,
    },
    {
      id: 'followups',
      label: 'Follow-ups done',
      current: followUpsCompleted,
      target: targetFollowUps,
      icon: Bell,
    },
  ];

  return (
    <div className="rounded-2xl bg-[#111111] border border-[#222222] p-4 md:p-5 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] text-white flex items-center justify-center border border-[#2a2a2a]">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wide">Progress This Week</h3>
        </div>

        <button
          onClick={onViewAnalytics}
          className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metrics List */}
      <div className="space-y-3.5">
        {metrics.map((m) => {
          const Icon = m.icon;
          const percent = Math.min(100, Math.round((m.current / m.target) * 100));

          return (
            <div key={m.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-neutral-300 font-medium">
                  <Icon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{m.label}</span>
                </div>
                <span className="font-mono text-neutral-400 text-xs font-semibold">
                  {m.current} / {m.target}
                </span>
              </div>

              {/* Progress bar (Monochrome white fill on charcoal track) */}
              <div className="w-full bg-[#1c1c1c] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-white"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
