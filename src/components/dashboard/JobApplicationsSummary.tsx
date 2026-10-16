'use client';

import React from 'react';
import { Briefcase, Plus, ArrowRight } from 'lucide-react';
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
        return 'bg-[#2a2a2a] text-white border-[#404040]';
      case 'follow_up_due':
        return 'bg-[#222222] text-neutral-200 border-[#383838]';
      case 'applied':
        return 'bg-[#1c1c1c] text-neutral-300 border-[#2e2e2e]';
      case 'offer':
        return 'bg-white text-black font-bold border-white';
      default:
        return 'bg-[#161616] text-neutral-400 border-[#262626]';
    }
  };

  const formatStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <div className="rounded-2xl bg-[#111111] border border-[#222222] p-4 md:p-5 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] text-white flex items-center justify-center border border-[#2a2a2a]">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wide">Job Applications</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewAllJobs}
            className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNewJob}
            className="p-1 rounded-md text-neutral-500 hover:text-white hover:bg-[#1a1a1a] transition-colors"
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
            className="p-3 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] hover:border-[#333333] transition-all cursor-pointer group flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-xs font-bold text-white shrink-0">
                {j.company.charAt(0)}
              </div>

              <div className="min-w-0">
                <h4 className="text-xs font-bold text-neutral-200 group-hover:text-white transition-colors truncate">
                  {j.company}
                </h4>
                <p className="text-[10px] text-neutral-500 truncate">{j.role}</p>
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
              <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
                {formatFriendlyDate(j.interviewDate ? j.interviewDate.split(' ')[0] : j.applicationDate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
