'use client';

import React, { useState } from 'react';
import { Zap, CheckSquare, Briefcase, FolderKanban, FileText, CornerDownLeft } from 'lucide-react';
import { parseNaturalDateString } from '@/lib/date-utils';
import { Task, JobApplication, Project, Note } from '@/types';

interface QuickCaptureCardProps {
  onCaptureTask: (task: Partial<Task>) => void;
  onCaptureJob: (job: Partial<JobApplication>) => void;
  onCaptureProject: (project: Partial<Project>) => void;
  onCaptureNote: (note: Partial<Note>) => void;
}

type CaptureType = 'task' | 'job' | 'project' | 'note';

export function QuickCaptureCard({
  onCaptureTask,
  onCaptureJob,
  onCaptureProject,
  onCaptureNote,
}: QuickCaptureCardProps) {
  const [input, setInput] = useState('');
  const [captureType, setCaptureType] = useState<CaptureType>('task');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const trimmed = input.trim();

    if (captureType === 'task') {
      const parsed = parseNaturalDateString(trimmed);
      onCaptureTask({
        title: parsed.cleanTitle,
        dueDate: parsed.dueDate,
        isRecurring: parsed.isRecurring,
        recurrenceRule: parsed.recurrenceRule,
        priority: parsed.priority || 'medium',
        status: parsed.dueDate ? 'todo' : 'inbox',
        tags: ['quick-capture'],
      });
      setSuccessNotice(`Task added: "${parsed.cleanTitle}"`);
    } else if (captureType === 'job') {
      onCaptureJob({
        company: trimmed,
        role: 'Pending Role Definition',
        status: 'interested',
        source: 'Other',
        location: 'Remote',
        workArrangement: 'Remote',
        applicationDate: new Date().toISOString().split('T')[0],
      });
      setSuccessNotice(`Job opportunity added: "${trimmed}"`);
    } else if (captureType === 'project') {
      onCaptureProject({
        name: trimmed,
        description: 'Created via Quick Capture',
        status: 'planning',
        priority: 'medium',
        color: '#3b82f6',
        milestones: [],
      });
      setSuccessNotice(`Project added: "${trimmed}"`);
    } else if (captureType === 'note') {
      onCaptureNote({
        title: trimmed,
        content: '',
        category: 'General',
        tags: ['quick-capture'],
      });
      setSuccessNotice(`Note created: "${trimmed}"`);
    }

    setInput('');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="rounded-2xl bg-[#0d1322] border border-[#1a253c] p-4 md:p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Zap className="w-4 h-4 fill-blue-500/20" />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wide">Quick Capture</h3>
        </div>

        <kbd className="text-[10px] bg-[#162035] text-slate-400 border border-[#23314f] px-1.5 py-0.5 rounded font-mono">
          Ctrl K
        </kbd>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task, job, project or note... (e.g. 'Fix LSSC website tomorrow')"
          className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 transition-all pr-10 shadow-inner"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          title="Press Enter to save"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Pill Selectors */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setCaptureType('task')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            captureType === 'task'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-[#11192b] text-slate-400 hover:text-slate-200 hover:bg-[#152038]'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          Task
        </button>

        <button
          type="button"
          onClick={() => setCaptureType('job')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            captureType === 'job'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'bg-[#11192b] text-slate-400 hover:text-slate-200 hover:bg-[#152038]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Job
        </button>

        <button
          type="button"
          onClick={() => setCaptureType('project')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            captureType === 'project'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
              : 'bg-[#11192b] text-slate-400 hover:text-slate-200 hover:bg-[#152038]'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5" />
          Project
        </button>

        <button
          type="button"
          onClick={() => setCaptureType('note')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            captureType === 'note'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
              : 'bg-[#11192b] text-slate-400 hover:text-slate-200 hover:bg-[#152038]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Note
        </button>

        {successNotice && (
          <span className="text-[11px] text-emerald-400 font-medium ml-auto animate-fade-in truncate">
            ✓ {successNotice}
          </span>
        )}
      </div>
    </div>
  );
}
