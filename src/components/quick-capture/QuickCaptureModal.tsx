'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckSquare,
  Briefcase,
  FolderKanban,
  FileText,
  Calendar,
  Clock,
  Flag,
  Tag,
  Link as LinkIcon,
} from 'lucide-react';
import { Task, JobApplication, Project, Note, Priority } from '@/types';
import { parseNaturalDateString, getTodayDateString } from '@/lib/date-utils';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  jobs: JobApplication[];
  onSaveTask: (task: Partial<Task>) => void;
  onSaveJob: (job: Partial<JobApplication>) => void;
  onSaveProject: (project: Partial<Project>) => void;
  onSaveNote: (note: Partial<Note>) => void;
}

type TabType = 'task' | 'job' | 'project' | 'note';

export function QuickCaptureModal({
  isOpen,
  onClose,
  projects,
  jobs,
  onSaveTask,
  onSaveJob,
  onSaveProject,
  onSaveNote,
}: QuickCaptureModalProps) {
  const [tab, setTab] = useState<TabType>('task');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [estimatedEffort, setEstimatedEffort] = useState('1');
  const [projectId, setProjectId] = useState('');
  const [jobId, setJobId] = useState('');
  const [tags, setTags] = useState('');
  const [isHardDeadline, setIsHardDeadline] = useState(false);

  // Job specific fields
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [salaryNotes, setSalaryNotes] = useState('');
  const [jobUrl, setJobUrl] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTitleBlur = () => {
    if (tab === 'task' && title) {
      const parsed = parseNaturalDateString(title);
      if (parsed.dueDate && !dueDate) {
        setDueDate(parsed.dueDate);
      }
      if (parsed.priority) {
        setPriority(parsed.priority);
      }
      if (parsed.cleanTitle !== title) {
        setTitle(parsed.cleanTitle);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !company.trim()) return;

    if (tab === 'task') {
      const parsed = parseNaturalDateString(title.trim());
      onSaveTask({
        title: parsed.cleanTitle || title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || parsed.dueDate || undefined,
        dueTime: dueTime || undefined,
        estimatedEffortHours: parseFloat(estimatedEffort) || 1,
        projectId: projectId || undefined,
        careerApplicationId: jobId || undefined,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        status: dueDate || parsed.dueDate ? 'todo' : 'inbox',
        isHardDeadline,
      });
    } else if (tab === 'job') {
      onSaveJob({
        company: company.trim() || title.trim(),
        role: role.trim() || 'Role to be reviewed',
        salaryNotes: salaryNotes || undefined,
        jobUrl: jobUrl || undefined,
        status: 'to_apply',
        source: 'Other',
        location: 'Remote',
        workArrangement: 'Remote',
        applicationDate: getTodayDateString(),
        notes: description.trim() || undefined,
      });
    } else if (tab === 'project') {
      onSaveProject({
        name: title.trim(),
        description: description.trim() || 'Project created via capture',
        status: 'planning',
        priority,
        color: '#3b82f6',
        milestones: [],
      });
    } else if (tab === 'note') {
      onSaveNote({
        title: title.trim(),
        content: description.trim(),
        category: 'General',
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        linkedProjectId: projectId || undefined,
        linkedJobId: jobId || undefined,
      });
    }

    // Reset & close
    setTitle('');
    setDescription('');
    setCompany('');
    setRole('');
    setDueDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0d1322] border border-[#22304d] shadow-2xl overflow-hidden animate-scale-up">
        {/* Header with Type Tabs */}
        <div className="flex items-center justify-between border-b border-[#1b2740] px-5 py-3.5 bg-[#090e18]">
          <div className="flex items-center gap-1.5 bg-[#121a2d] p-1 rounded-xl border border-[#1e2a44]">
            <button
              onClick={() => setTab('task')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === 'task'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Task
            </button>
            <button
              onClick={() => setTab('job')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === 'job'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Job Application
            </button>
            <button
              onClick={() => setTab('project')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === 'project'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              Project
            </button>
            <button
              onClick={() => setTab('note')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === 'note'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Note
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#18233c] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {tab === 'job' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, TechCorp"
                  className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Job Post URL</label>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://company.com/careers/..."
                  className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                {tab === 'task' ? 'Title (natural phrases like "Fix bug tomorrow" supported)' : 'Title'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                placeholder={
                  tab === 'task'
                    ? 'What needs to be done?'
                    : tab === 'project'
                    ? 'Project name'
                    : 'Note title'
                }
                className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key context, requirements or reminders..."
              className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Task-specific fields */}
          {tab === 'task' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                    <Flag className="w-3 h-3 text-amber-400" />
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-blue-400" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-purple-400" />
                    Effort (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.25"
                    value={estimatedEffort}
                    onChange={(e) => setEstimatedEffort(e.target.value)}
                    className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                    <Tag className="w-3 h-3 text-teal-400" />
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="dev, urgent"
                    className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Project / Job Linking */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                    <FolderKanban className="w-3 h-3 text-blue-400" />
                    Link to Project
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">None (Personal)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                    <Briefcase className="w-3 h-3 text-purple-400" />
                    Link to Job Application
                  </label>
                  <select
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">None</option>
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.company} ({j.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#1b2740]">
            <span className="text-[11px] text-slate-500">
              {tab === 'task' && !dueDate ? 'Will enter Inbox triage.' : 'Will be saved immediately.'}
            </span>

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
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
              >
                Capture {tab.toUpperCase()}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
