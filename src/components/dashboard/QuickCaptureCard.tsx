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
      setSuccessNotice(`Job added: "${trimmed}"`);
    } else if (captureType === 'project') {
      onCaptureProject({
        name: trimmed,
        description: 'Created via Quick Capture',
        status: 'planning',
        priority: 'medium',
        color: '#ffffff',
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
      setSuccessNotice(`Note added: "${trimmed}"`);
    }

    setInput('');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="rounded-2xl bg-[#111111] border border-[#222222] p-4 md:p-5 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] text-white flex items-center justify-center border border-[#2a2a2a]">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wide">Quick Capture</h3>
        </div>

        <kbd className="text-[10px] bg-[#1a1a1a] text-neutral-400 border border-[#2a2a2a] px-1.5 py-0.5 rounded font-mono">
          Ctrl K
        </kbd>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task, job, project or note..."
          className="w-full bg-[#0d0d0d] border border-[#222222] rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 transition-all pr-10"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            captureType === 'task'
              ? 'bg-white text-black border-white shadow-sm'
              : 'bg-[#141414] text-neutral-400 border-[#222222] hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          Task
        </button>

        <button
          type="button"
          onClick={() => setCaptureType('job')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            captureType === 'job'
              ? 'bg-white text-black border-white shadow-sm'
              : 'bg-[#141414] text-neutral-400 border-[#222222] hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Job
        </button>

        <button
          type="button"
          onClick={() => setCaptureType('project')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            captureType === 'project'
              ? 'bg-white text-black border-white shadow-sm'
              : 'bg-[#141414] text-neutral-400 border-[#222222] hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5" />
          Project
        </button>

        <button
          type="button"
          onClick={() => setCaptureType('note')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            captureType === 'note'
              ? 'bg-white text-black border-white shadow-sm'
              : 'bg-[#141414] text-neutral-400 border-[#222222] hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Note
        </button>

        {successNotice && (
          <span className="text-[11px] text-neutral-300 font-medium ml-auto animate-fade-in truncate">
            ✓ {successNotice}
          </span>
        )}
      </div>
    </div>
  );
}
