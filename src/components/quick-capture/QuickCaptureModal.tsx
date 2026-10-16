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
        color: '#ffffff',
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

    setTitle('');
    setDescription('');
    setCompany('');
    setRole('');
    setDueDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#111111] border border-[#262626] shadow-2xl overflow-hidden">
        {/* Header with Type Tabs */}
        <div className="flex items-center justify-between border-b border-[#202020] px-5 py-3.5 bg-[#0a0a0a]">
          <div className="flex items-center gap-1.5 bg-[#161616] p-1 rounded-xl border border-[#262626]">
            <button
              onClick={() => setTab('task')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === 'task'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Task
            </button>
            <button
              onClick={() => setTab('job')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === 'job'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Job Application
            </button>
            <button
              onClick={() => setTab('project')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === 'project'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              Project
            </button>
            <button
              onClick={() => setTab('note')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === 'note'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Note
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1f1f1f] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {tab === 'job' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, TechCorp"
                  className="w-full bg-[#0d0d0d] border border-[#242424] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-[#0d0d0d] border border-[#242424] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Job Post URL</label>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://company.com/careers/..."
                  className="w-full bg-[#0d0d0d] border border-[#242424] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                {tab === 'task' ? 'Title' : 'Title'}
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
                className="w-full bg-[#0d0d0d] border border-[#242424] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400"
                autoFocus
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key context, requirements or reminders..."
              className="w-full bg-[#0d0d0d] border border-[#242424] rounded-xl px-3.5 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 resize-none"
            />
          </div>

          {/* Task-specific fields */}
          {tab === 'task' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                    <Flag className="w-3 h-3 text-neutral-400" />
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-[#0d0d0d] border border-[#242424] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-neutral-400" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#242424] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    Effort (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.25"
                    value={estimatedEffort}
                    onChange={(e) => setEstimatedEffort(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#242424] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                    <Tag className="w-3 h-3 text-neutral-400" />
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="dev, client"
                    className="w-full bg-[#0d0d0d] border border-[#242424] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>

              {/* Project / Job Linking */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                    Link to Project
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#242424] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
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
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                    Link to Job Application
                  </label>
                  <select
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#242424] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
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
          <div className="flex items-center justify-between pt-3 border-t border-[#202020]">
            <span className="text-[11px] text-neutral-500">
              {tab === 'task' && !dueDate ? 'Will enter Inbox triage.' : 'Will be saved immediately.'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all active:scale-95 shadow-sm"
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
