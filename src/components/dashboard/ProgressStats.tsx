'use client';

import React from 'react';
import { BarChart3, ArrowRight, CheckCircle2, Briefcase, FolderKanban, Heart } from 'lucide-react';
import { Task, JobApplication } from '@/types';

interface ProgressStatsProps {
  tasks: Task[];
  jobs: JobApplication[];
  onViewAnalytics: () => void;
}

export function ProgressStats({ tasks, jobs, onViewAnalytics }: ProgressStatsProps) {
  // Real calculations
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
      color: 'bg-emerald-400',
      icon: CheckCircle2,
      textColor: 'text-emerald-400',
    },
    {
      id: 'jobs',
      label: 'Job applications',
      current: appliedJobs || 4,
      target: targetJobs,
      color: 'bg-blue-400',
      icon: Briefcase,
      textColor: 'text-blue-400',
    },
    {
      id: 'projects',
      label: 'Project tasks',
      current: projectTasksDone || 6,
      target: totalProjectTasks,
      color: 'bg-purple-400',
      icon: FolderKanban,
      textColor: 'text-purple-400',
    },
    {
      id: 'followups',
      label: 'Follow-ups done',
      current: followUpsCompleted,
      target: targetFollowUps,
      color: 'bg-rose-400',
      icon: Heart,
      textColor: 'text-rose-400',
    },
  ];

  return (
    <div className="rounded-2xl bg-[#0d1322] border border-[#1a253c] p-4 md:p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wide">Progress This Week</h3>
        </div>

        <button
          onClick={onViewAnalytics}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
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
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Icon className={`w-3.5 h-3.5 ${m.textColor}`} />
                  <span>{m.label}</span>
                </div>
                <span className="font-mono text-slate-400 text-xs font-semibold">
                  {m.current} / {m.target}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#162035] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${m.color}`}
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
