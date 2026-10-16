'use client';

import React from 'react';
import { Briefcase, Plus, ArrowRight, Building2 } from 'lucide-react';
import { JobApplication } from '@/types';
import { formatFriendlyDate } from '@/lib/date-utils';

interface JobApplicationsSummaryProps {
  jobs: JobApplication[];
  onViewAllJobs: () => void;
  onNewJob: () => void;
  onSelectJob: (job: JobApplication) => void;
}

export function JobApplicationsSummary({
  jobs,
  onViewAllJobs,
  onNewJob,
  onSelectJob,
}: JobApplicationsSummaryProps) {
  const getStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case 'interview':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'follow_up_due':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'applied':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'offer':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'rejected':
      case 'withdrawn':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'interested':
      case 'to_apply':
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const formatStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <div className="rounded-2xl bg-[#0d1322] border border-[#1a253c] p-4 md:p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Briefcase className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wide">Job Applications</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewAllJobs}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNewJob}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#162035] transition-colors"
            title="Add Application"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-2.5">
        {jobs.slice(0, 4).map((j) => (
          <div
            key={j.id}
            onClick={() => onSelectJob(j)}
            className="p-3 rounded-xl bg-[#0a0f1c] border border-[#172238] hover:border-[#273756] transition-all cursor-pointer group flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#141e33] border border-[#23314f] flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
                {j.company.charAt(0)}
              </div>

              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                  {j.company}
                </h4>
                <p className="text-[10px] text-slate-400 truncate">{j.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border capitalize ${getStatusBadge(
                  j.status
                )}`}
              >
                {formatStatusLabel(j.status)}
              </span>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                {formatFriendlyDate(j.interviewDate ? j.interviewDate.split(' ')[0] : j.applicationDate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
