'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Kanban,
  Table as TableIcon,
  Search,
  ExternalLink,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { JobApplication, JobStatus, Task } from '@/types';
import { formatFriendlyDate, getTodayDateString } from '@/lib/date-utils';
import { JobModal } from './JobModal';

interface CareerViewProps {
  jobs: JobApplication[];
  tasks: Task[];
  onSaveJob: (job: JobApplication) => void;
  onDeleteJob: (id: string) => void;
  onCreateFollowUpTask: (job: JobApplication) => void;
}

const CAREER_PIPELINE: { id: JobStatus; label: string; color: string }[] = [
  { id: 'interested', label: 'Interested', color: 'border-slate-500' },
  { id: 'to_apply', label: 'To Apply', color: 'border-blue-500' },
  { id: 'applied', label: 'Applied', color: 'border-cyan-500' },
  { id: 'follow_up_due', label: 'Follow-up Due', color: 'border-amber-500' },
  { id: 'interview', label: 'Interview', color: 'border-purple-500' },
  { id: 'offer', label: 'Offer', color: 'border-emerald-500' },
  { id: 'rejected', label: 'Rejected', color: 'border-rose-500' },
];

export function CareerView({
  jobs,
  tasks,
  onSaveJob,
  onDeleteJob,
  onCreateFollowUpTask,
}: CareerViewProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayStr = getTodayDateString();

  // Metrics
  const totalSubmitted = jobs.filter((j) => j.status !== 'interested' && j.status !== 'to_apply').length;
  const interviewsCount = jobs.filter((j) => j.status === 'interview').length;
  const followUpsDue = jobs.filter((j) => j.status === 'follow_up_due' || j.nextFollowUpDate === todayStr).length;
  const responseRate = totalSubmitted > 0 ? Math.round((interviewsCount / totalSubmitted) * 100) : 0;

  const filteredJobs = jobs.filter((j) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        j.company.toLowerCase().includes(q) ||
        j.role.toLowerCase().includes(q) ||
        (j.recruiterName && j.recruiterName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'interview':
        return 'text-purple-400 bg-purple-500/15 border-purple-500/30';
      case 'follow_up_due':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
      case 'applied':
        return 'text-blue-400 bg-blue-500/15 border-blue-500/30';
      case 'offer':
        return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
      case 'rejected':
      case 'withdrawn':
        return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
      default:
        return 'text-slate-400 bg-slate-500/15 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Career & Job Tracker</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your interview pipeline, follow-ups, and recruiter interactions.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedJob(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 active:scale-95 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Application</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-[#1a253c]">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Submitted</span>
          <span className="text-2xl font-black text-white mt-0.5 block">{totalSubmitted}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-[#1a253c]">
          <span className="text-[11px] text-slate-400 font-semibold block">Interviews</span>
          <span className="text-2xl font-black text-purple-400 mt-0.5 block">{interviewsCount}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-[#1a253c]">
          <span className="text-[11px] text-slate-400 font-semibold block">Follow-ups Due</span>
          <span className="text-2xl font-black text-amber-400 mt-0.5 block">{followUpsDue}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-[#1a253c]">
          <span className="text-[11px] text-slate-400 font-semibold block">Interview Rate</span>
          <span className="text-2xl font-black text-emerald-400 mt-0.5 block">{responseRate}%</span>
        </div>
      </div>

      {/* View Switcher and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#0d1322] border border-[#1a253c]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#162035]'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Pipeline
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#162035]'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            Table
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or role..."
            className="bg-[#0a0f1c] border border-[#1e2a44] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Content View */}
      {viewMode === 'kanban' ? (
        /* KANBAN PIPELINE */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
          {CAREER_PIPELINE.map((col) => {
            const colJobs = filteredJobs.filter((j) => j.status === col.id);

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl bg-[#0a0f1c] border border-[#172238] p-3 min-w-[220px]"
              >
                <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#151f33]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full border-2 ${col.color}`} />
                    <span className="text-xs font-bold text-white tracking-wide">{col.label}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#131d33] text-slate-400 font-bold">
                    {colJobs.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 min-h-[350px]">
                  {colJobs.map((j) => (
                    <div
                      key={j.id}
                      onClick={() => {
                        setSelectedJob(j);
                        setIsModalOpen(true);
                      }}
                      className="p-3 rounded-xl bg-[#0d1322] border border-[#1c273e] hover:border-[#2b3c61] transition-all cursor-pointer shadow-sm space-y-2 group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-100 group-hover:text-purple-400 transition-colors">
                            {j.company}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">{j.role}</p>
                        </div>
                        {j.jobUrl && (
                          <a
                            href={j.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 text-slate-500 hover:text-slate-300"
                            title="Open job posting"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-[#162035] text-slate-300">
                          {j.workArrangement}
                        </span>
                        {j.salaryNotes && (
                          <span className="truncate max-w-[90px]">{j.salaryNotes}</span>
                        )}
                      </div>

                      {/* Recruiter or Follow-up */}
                      {(j.recruiterName || j.nextFollowUpDate || j.interviewDate) && (
                        <div className="pt-2 border-t border-[#151f33] text-[10px] text-slate-400 space-y-1">
                          {j.interviewDate && (
                            <div className="text-purple-300 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-purple-400" />
                              <span>{j.interviewDate}</span>
                            </div>
                          )}
                          {j.nextFollowUpDate && (
                            <div className="flex items-center justify-between">
                              <span className="text-amber-400">Follow-up: {j.nextFollowUpDate}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCreateFollowUpTask(j);
                                }}
                                className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[9px] font-bold"
                              >
                                + Task
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl bg-[#0d1322] border border-[#1a253c] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090e18] border-b border-[#1b2740] text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3.5">Company</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Source</th>
                  <th className="p-3.5">Applied Date</th>
                  <th className="p-3.5">Next Action</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151f33]">
                {filteredJobs.map((j) => (
                  <tr
                    key={j.id}
                    onClick={() => {
                      setSelectedJob(j);
                      setIsModalOpen(true);
                    }}
                    className="hover:bg-[#11192b] transition-colors cursor-pointer"
                  >
                    <td className="p-3.5 font-bold text-slate-200">{j.company}</td>
                    <td className="p-3.5 text-slate-300">{j.role}</td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border capitalize ${getStatusBadge(
                          j.status
                        )}`}
                      >
                        {j.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">{j.source}</td>
                    <td className="p-3.5 text-slate-400 font-mono">{j.applicationDate}</td>
                    <td className="p-3.5 text-amber-400 font-mono">
                      {j.nextFollowUpDate || j.interviewDate || '—'}
                    </td>
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onCreateFollowUpTask(j)}
                        className="px-2 py-1 rounded bg-[#162035] hover:bg-blue-600 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
                      >
                        Create Task
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Job Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={selectedJob}
        onSaveJob={(j) => {
          onSaveJob(j);
          setIsModalOpen(false);
        }}
        onDeleteJob={(id) => {
          onDeleteJob(id);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
