'use client';

import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  FolderKanban,
} from 'lucide-react';
import { Task, Project, JobApplication } from '@/types';
import { getTodayDateString } from '@/lib/date-utils';

interface AnalyticsViewProps {
  tasks: Task[];
  projects: Project[];
  jobs: JobApplication[];
}

export function AnalyticsView({ tasks, projects, jobs }: AnalyticsViewProps) {
  const todayStr = getTodayDateString();

  // Metrics from real data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const overdueTasks = tasks.filter(
    (t) => t.status !== 'done' && t.status !== 'cancelled' && t.dueDate && t.dueDate < todayStr
  ).length;

  // Career pipeline funnel
  const totalApplications = jobs.length;
  const activeApplications = jobs.filter(
    (j) => j.status !== 'rejected' && j.status !== 'withdrawn'
  ).length;
  const interviews = jobs.filter((j) => j.status === 'interview').length;
  const offers = jobs.filter((j) => j.status === 'offer').length;
  const interviewConversionRate =
    totalApplications > 0 ? Math.round((interviews / totalApplications) * 100) : 0;

  // Priority distribution
  const priorityCounts = {
    critical: tasks.filter((t) => t.priority === 'critical').length,
    high: tasks.filter((t) => t.priority === 'high').length,
    medium: tasks.filter((t) => t.priority === 'medium').length,
    low: tasks.filter((t) => t.priority === 'low').length,
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Performance Analytics</h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Honest, real-time productivity statistics and pipeline conversion metrics calculated from active records.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#111111] border border-[#222222] shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-semibold">Task Velocity</span>
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-2xl font-black text-white block">
            {completedTasks} / {totalTasks}
          </span>
          <span className="text-[11px] text-neutral-300 font-semibold mt-1 block">
            {taskCompletionRate}% completion rate
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111111] border border-[#222222] shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-semibold">Overdue Attention</span>
            <AlertTriangle className="w-4 h-4 text-neutral-400" />
          </div>
          <span className="text-2xl font-black text-white block">{overdueTasks}</span>
          <span className="text-[11px] text-neutral-400 font-medium mt-1 block">
            Requires immediate scheduling
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111111] border border-[#222222] shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-semibold">Interview Funnel</span>
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="text-2xl font-black text-white block">{interviews}</span>
          <span className="text-[11px] text-neutral-400 font-medium mt-1 block">
            {interviewConversionRate}% from {totalApplications} applications
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111111] border border-[#222222] shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-semibold">Active Projects</span>
            <FolderKanban className="w-4 h-4 text-white" />
          </div>
          <span className="text-2xl font-black text-white block">{projects.length}</span>
          <span className="text-[11px] text-neutral-400 font-medium mt-1 block">
            Workspaces under active tracking
          </span>
        </div>
      </div>

      {/* Career Conversion Pipeline & Project Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Career Pipeline Funnel */}
        <div className="p-5 rounded-2xl bg-[#111111] border border-[#222222] shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-white tracking-wide uppercase">
            Job Application Conversion Pipeline
          </h3>

          <div className="space-y-3">
            {[
              {
                stage: 'Applications Submitted',
                count: totalApplications,
                percent: 100,
                barClass: 'bg-white',
              },
              {
                stage: 'Active Responses / Review',
                count: activeApplications,
                percent: totalApplications > 0 ? Math.round((activeApplications / totalApplications) * 100) : 0,
                barClass: 'bg-neutral-300',
              },
              {
                stage: 'Interviews Scheduled',
                count: interviews,
                percent: totalApplications > 0 ? Math.round((interviews / totalApplications) * 100) : 0,
                barClass: 'bg-neutral-400',
              },
              {
                stage: 'Offers Extended',
                count: offers,
                percent: totalApplications > 0 ? Math.round((offers / totalApplications) * 100) : 0,
                barClass: 'bg-neutral-500',
              },
            ].map((step) => (
              <div key={step.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300 font-medium">{step.stage}</span>
                  <span className="font-mono font-bold text-neutral-400">
                    {step.count} ({step.percent}%)
                  </span>
                </div>
                <div className="w-full bg-[#1a1a1a] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${step.barClass}`}
                    style={{ width: `${step.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Priority Breakdown */}
        <div className="p-5 rounded-2xl bg-[#111111] border border-[#222222] shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-white tracking-wide uppercase">
            Task Priority Distribution
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Critical (P1)', count: priorityCounts.critical, barClass: 'bg-white', text: 'text-white font-bold' },
              { label: 'High (P2)', count: priorityCounts.high, barClass: 'bg-neutral-300', text: 'text-neutral-200 font-semibold' },
              { label: 'Medium (P3)', count: priorityCounts.medium, barClass: 'bg-neutral-500', text: 'text-neutral-400' },
              { label: 'Low (P4)', count: priorityCounts.low, barClass: 'bg-neutral-700', text: 'text-neutral-500' },
            ].map((p) => {
              const percent = totalTasks > 0 ? Math.round((p.count / totalTasks) * 100) : 0;
              return (
                <div key={p.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold ${p.text}`}>{p.label}</span>
                    <span className="font-mono text-neutral-400">
                      {p.count} tasks ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#1a1a1a] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p.barClass}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
