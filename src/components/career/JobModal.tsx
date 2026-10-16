'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Briefcase,
  DollarSign,
  Calendar,
  Globe,
  User,
  Mail,
  Trash2,
  FileCheck,
} from 'lucide-react';
import { JobApplication, JobStatus } from '@/types';
import { getTodayDateString } from '@/lib/date-utils';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: JobApplication | null;
  onSaveJob: (job: JobApplication) => void;
  onDeleteJob?: (id: string) => void;
}

export function JobModal({ isOpen, onClose, job, onSaveJob, onDeleteJob }: JobModalProps) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [source, setSource] = useState<JobApplication['source']>('LinkedIn');
  const [location, setLocation] = useState('Remote');
  const [workArrangement, setWorkArrangement] = useState<JobApplication['workArrangement']>('Remote');
  const [salaryNotes, setSalaryNotes] = useState('');
  const [applicationDate, setApplicationDate] = useState(getTodayDateString());
  const [status, setStatus] = useState<JobStatus>('applied');
  const [resumeVersion, setResumeVersion] = useState('Resume_Security_v2.pdf');
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewStage, setInterviewStage] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (job) {
      setCompany(job.company || '');
      setRole(job.role || '');
      setJobUrl(job.jobUrl || '');
      setSource(job.source || 'LinkedIn');
      setLocation(job.location || 'Remote');
      setWorkArrangement(job.workArrangement || 'Remote');
      setSalaryNotes(job.salaryNotes || '');
      setApplicationDate(job.applicationDate || getTodayDateString());
      setStatus(job.status || 'applied');
      setResumeVersion(job.resumeVersion || '');
      setRecruiterName(job.recruiterName || '');
      setRecruiterEmail(job.recruiterEmail || '');
      setNextFollowUpDate(job.nextFollowUpDate || '');
      setInterviewDate(job.interviewDate || '');
      setInterviewStage(job.interviewStage || '');
      setNotes(job.notes || '');
    } else {
      setCompany('');
      setRole('');
      setJobUrl('');
      setSource('LinkedIn');
      setLocation('Remote');
      setWorkArrangement('Remote');
      setSalaryNotes('');
      setApplicationDate(getTodayDateString());
      setStatus('applied');
      setResumeVersion('Resume_Security_v2.pdf');
      setRecruiterName('');
      setRecruiterEmail('');
      setNextFollowUpDate('');
      setInterviewDate('');
      setInterviewStage('');
      setNotes('');
    }
  }, [job, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const updated: JobApplication = {
      id: job?.id || `job-${Date.now()}`,
      company: company.trim(),
      role: role.trim(),
      jobUrl: jobUrl.trim() || undefined,
      source,
      location: location.trim() || 'Remote',
      workArrangement,
      salaryNotes: salaryNotes.trim() || undefined,
      applicationDate,
      status,
      resumeVersion: resumeVersion.trim() || undefined,
      recruiterName: recruiterName.trim() || undefined,
      recruiterEmail: recruiterEmail.trim() || undefined,
      nextFollowUpDate: nextFollowUpDate || undefined,
      interviewDate: interviewDate || undefined,
      interviewStage: interviewStage.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: job?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveJob(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0d1322] border border-[#22304d] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1b2740] px-5 py-4 bg-[#090e18]">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              {job ? `Edit Application: ${job.company}` : 'Track Job Application'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#18233c] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Company & Role */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Company Name</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Monotype, TechCorp"
                className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Role Title</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Information Security Analyst"
                className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Job Post URL */}
          <div>
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-1">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              Job Posting URL
            </label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Status & Pipeline Stage */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Pipeline Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 capitalize"
              >
                <option value="interested">Interested</option>
                <option value="to_apply">To Apply</option>
                <option value="applied">Applied</option>
                <option value="follow_up_due">Follow-up Due</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as JobApplication['source'])}
                className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Naukri">Naukri</option>
                <option value="Company Career Page">Company Career Page</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Work Arrangement</label>
              <select
                value={workArrangement}
                onChange={(e) => setWorkArrangement(e.target.value as JobApplication['workArrangement'])}
                className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          {/* Dates & Compensation */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Application Date
              </label>
              <input
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Next Follow-up
              </label>
              <input
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Salary Notes
              </label>
              <input
                type="text"
                value={salaryNotes}
                onChange={(e) => setSalaryNotes(e.target.value)}
                placeholder="e.g. $110,000 - $125,000"
                className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Recruiter Contact & Resume Version */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Recruiter Name
              </label>
              <input
                type="text"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-1">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                Recruiter Email
              </label>
              <input
                type="email"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                placeholder="recruiter@company.com"
                className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-1">
                <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                Resume Version
              </label>
              <input
                type="text"
                value={resumeVersion}
                onChange={(e) => setResumeVersion(e.target.value)}
                placeholder="Resume_Security_v2.pdf"
                className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Interview Details if Applicable */}
          {(status === 'interview' || interviewDate) && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/25 space-y-3">
              <h4 className="text-xs font-bold text-purple-300">Upcoming Interview Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Interview Date & Time
                  </label>
                  <input
                    type="text"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    placeholder="2026-10-17 14:00"
                    className="w-full bg-[#0d1322] border border-[#23314f] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Stage / Panel
                  </label>
                  <input
                    type="text"
                    value={interviewStage}
                    onChange={(e) => setInterviewStage(e.target.value)}
                    placeholder="Round 1 Technical / Hiring Manager"
                    className="w-full bg-[#0d1322] border border-[#23314f] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Notes & Interaction History</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record interviewer questions, feedback, required prep..."
              className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#1b2740]">
            {job && onDeleteJob ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this job application record?')) {
                    onDeleteJob(job.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#162035] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
              >
                Save Application
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
