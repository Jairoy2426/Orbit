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

const CAREER_PIPELINE: { id: JobStatus; label: string; dotClass: string }[] = [
  { id: 'interested', label: 'Interested', dotClass: 'border-neutral-600 bg-neutral-800' },
  { id: 'to_apply', label: 'To Apply', dotClass: 'border-neutral-500 bg-neutral-700' },
  { id: 'applied', label: 'Applied', dotClass: 'border-neutral-400 bg-neutral-600' },
  { id: 'follow_up_due', label: 'Follow-up Due', dotClass: 'border-neutral-300 bg-neutral-400' },
  { id: 'interview', label: 'Interview', dotClass: 'border-white bg-white' },
  { id: 'offer', label: 'Offer', dotClass: 'border-neutral-200 bg-white' },
  { id: 'rejected', label: 'Rejected', dotClass: 'border-neutral-700 bg-neutral-900' },
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
      case 'offer':
        return 'text-black bg-white border-white font-bold';
      case 'follow_up_due':
        return 'text-neutral-200 bg-[#2b2b2b] border-[#404040] font-semibold';
      case 'applied':
        return 'text-neutral-200 bg-[#222222] border-[#333333]';
      case 'rejected':
      case 'withdrawn':
        return 'text-neutral-500 bg-[#141414] border-[#222222] line-through';
      default:
        return 'text-neutral-400 bg-[#161616] border-[#262626]';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Career & Job Tracker</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage your interview pipeline, follow-ups, and recruiter interactions.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedJob(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-sm active:scale-95 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Application</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#111111] border border-[#222222]">
          <span className="text-[11px] text-neutral-400 font-semibold block">Total Submitted</span>
          <span className="text-2xl font-black text-white mt-0.5 block">{totalSubmitted}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#111111] border border-[#222222]">
          <span className="text-[11px] text-neutral-400 font-semibold block">Interviews</span>
          <span className="text-2xl font-black text-white mt-0.5 block">{interviewsCount}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#111111] border border-[#222222]">
          <span className="text-[11px] text-neutral-400 font-semibold block">Follow-ups Due</span>
          <span className="text-2xl font-black text-neutral-200 mt-0.5 block">{followUpsDue}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#111111] border border-[#222222]">
          <span className="text-[11px] text-neutral-400 font-semibold block">Interview Rate</span>
          <span className="text-2xl font-black text-white mt-0.5 block">{responseRate}%</span>
        </div>
      </div>

      {/* View Switcher and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#111111] border border-[#222222]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Pipeline Board
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            Table View
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or role..."
            className="bg-[#0c0c0c] border border-[#222222] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 w-full sm:w-60"
          />
        </div>
      </div>

      {/* Main View */}
      {viewMode === 'kanban' ? (
        /* KANBAN PIPELINE */
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
          {CAREER_PIPELINE.map((col) => {
            const colJobs = filteredJobs.filter((j) => j.status === col.id);

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl bg-[#111111] border border-[#222222] p-3 min-w-[210px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#1c1c1c]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full border ${col.dotClass}`} />
                    <span className="text-xs font-bold text-white truncate max-w-[120px]">
                      {col.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#181818] text-neutral-400 border border-[#252525] font-bold">
                    {colJobs.length}
                  </span>
                </div>

                {/* Job Cards */}
                <div className="space-y-2 flex-1 min-h-[350px]">
                  {colJobs.map((j) => {
                    const isFollowUpDue =
                      j.nextFollowUpDate && j.nextFollowUpDate <= todayStr;

                    return (
                      <div
                        key={j.id}
                        onClick={() => {
                          setSelectedJob(j);
                          setIsModalOpen(true);
                        }}
                        className="p-3 rounded-xl bg-[#0c0c0c] border border-[#222222] hover:border-[#383838] transition-all cursor-pointer shadow-sm space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-xs font-bold text-white block group-hover:text-neutral-200 transition-colors">
                              {j.company}
                            </span>
                            <span className="text-[11px] text-neutral-400 block truncate max-w-[150px]">
                              {j.role}
                            </span>
                          </div>
                          {j.jobUrl && (
                            <a
                              href={j.jobUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-neutral-500 hover:text-white p-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {/* Follow up pill */}
                        {isFollowUpDue && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-white px-2 py-0.5 rounded bg-[#262626] border border-[#3a3a3a]">
                            <Clock className="w-3 h-3 text-white" />
                            Follow-up Due Today
                          </div>
                        )}

                        {/* Interview Date badge */}
                        {j.interviewDate && (
                          <div className="flex items-center gap-1 text-[10px] text-neutral-300 font-medium">
                            <Calendar className="w-3 h-3 text-neutral-400" />
                            <span>{formatFriendlyDate(j.interviewDate)}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-[#1a1a1a] text-[10px] text-neutral-400">
                          <span>{j.location || 'Remote'}</span>
                          <span>{j.source}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl bg-[#111111] border border-[#222222] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#0a0a0a] text-neutral-400 uppercase text-[10px] font-bold tracking-wider border-b border-[#222222]">
                <tr>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Next Step / Follow-up</th>
                  <th className="px-4 py-3">Applied Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c1c]">
                {filteredJobs.map((j) => (
                  <tr
                    key={j.id}
                    onClick={() => {
                      setSelectedJob(j);
                      setIsModalOpen(true);
                    }}
                    className="hover:bg-[#161616] transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3.5 font-bold text-white">{j.company}</td>
                    <td className="px-4 py-3.5 text-neutral-300">{j.role}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(
                          j.status
                        )}`}
                      >
                        {j.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-neutral-400">{j.source}</td>
                    <td className="px-4 py-3.5">
                      {j.nextFollowUpDate ? (
                        <span className="font-mono text-neutral-300">
                          {formatFriendlyDate(j.nextFollowUpDate)}
                        </span>
                      ) : j.interviewDate ? (
                        <span className="font-mono text-white font-bold">
                          Interview: {formatFriendlyDate(j.interviewDate)}
                        </span>
                      ) : (
                        <span className="text-neutral-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-neutral-400">
                      {formatFriendlyDate(j.applicationDate)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCreateFollowUpTask(j);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#1a1a1a] hover:bg-white hover:text-black border border-[#2b2b2b] text-[10px] font-semibold text-neutral-300 transition-all"
                      >
                        + Follow-up Task
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <JobModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          job={selectedJob}
          onSaveJob={onSaveJob}
          onDeleteJob={onDeleteJob}
        />
      )}
    </div>
  );
}
