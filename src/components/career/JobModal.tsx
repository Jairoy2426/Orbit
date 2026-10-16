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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#111111] border border-[#252525] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222222] px-5 py-4 bg-[#0a0a0a]">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-white" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              {job ? `Edit Application: ${job.company}` : 'Track Job Application'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Company & Role */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">Company Name</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Monotype"
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">Target Role</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Information Security Analyst"
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          {/* Job URL & Source */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                <Globe className="w-3.5 h-3.5 text-neutral-400" />
                Job Posting URL
              </label>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Naukri">Naukri</option>
                <option value="Company Website">Company Website</option>
                <option value="Referral">Referral</option>
                <option value="Indeed">Indeed</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Pipeline Status & Application Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">Pipeline Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
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
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                Applied Date
              </label>
              <input
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          {/* Location & Compensation */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pune / Bengaluru"
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">Arrangement</label>
              <select
                value={workArrangement}
                onChange={(e) => setWorkArrangement(e.target.value as any)}
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                Salary / Budget Notes
              </label>
              <input
                type="text"
                value={salaryNotes}
                onChange={(e) => setSalaryNotes(e.target.value)}
                placeholder="e.g. 15-18 LPA"
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          {/* Recruiter & Resume Version */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                Recruiter Contact
              </label>
              <input
                type="text"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                placeholder="Name"
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                Recruiter Email
              </label>
              <input
                type="email"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                placeholder="email@company.com"
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                <FileCheck className="w-3.5 h-3.5 text-neutral-400" />
                Resume File Used
              </label>
              <input
                type="text"
                value={resumeVersion}
                onChange={(e) => setResumeVersion(e.target.value)}
                placeholder="e.g. Resume_Security_v2.pdf"
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          {/* Follow-up & Interview Schedule */}
          <div className="p-3.5 rounded-xl bg-[#0a0a0a] border border-[#222222] space-y-3">
            <span className="text-xs font-bold text-white block">
              Follow-up & Interview Schedule
            </span>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Next Follow-up Due
                </label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  className="w-full bg-[#111111] border border-[#262626] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Interview Date
                </label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full bg-[#111111] border border-[#262626] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Interview Stage
                </label>
                <input
                  type="text"
                  value={interviewStage}
                  onChange={(e) => setInterviewStage(e.target.value)}
                  placeholder="e.g. Round 2: Technical"
                  className="w-full bg-[#111111] border border-[#262626] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
                />
              </div>
            </div>
          </div>

          {/* Freeform Notes */}
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">Notes & Next Actions</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Spoke with hiring manager; review OAuth2 & Splunk before Thursday round."
              className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3.5 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#222222]">
            {job && onDeleteJob ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this job application record?')) {
                    onDeleteJob(job.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
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
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-[#1c1c1c] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-sm active:scale-95 transition-all"
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
