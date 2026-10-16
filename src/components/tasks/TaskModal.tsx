'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Flag,
  Tag,
  FolderKanban,
  Briefcase,
  Trash2,
  Repeat,
  ShieldAlert,
} from 'lucide-react';
import { Task, Project, JobApplication, TaskStatus, Priority } from '@/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  projects: Project[];
  jobs: JobApplication[];
  onSaveTask: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

export function TaskModal({
  isOpen,
  onClose,
  task,
  projects,
  jobs,
  onSaveTask,
  onDeleteTask,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [estimatedEffort, setEstimatedEffort] = useState('1');
  const [projectId, setProjectId] = useState('');
  const [jobId, setJobId] = useState('');
  const [tags, setTags] = useState('');
  const [isHardDeadline, setIsHardDeadline] = useState(false);
  const [consequencesOfDelay, setConsequencesOfDelay] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState<Task['recurrenceRule']>('weekly');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate || '');
      setDueTime(task.dueTime || '');
      setEstimatedEffort(task.estimatedEffortHours?.toString() || '1');
      setProjectId(task.projectId || '');
      setJobId(task.careerApplicationId || '');
      setTags(task.tags ? task.tags.join(', ') : '');
      setIsHardDeadline(Boolean(task.isHardDeadline));
      setConsequencesOfDelay(task.consequencesOfDelay || '');
      setIsRecurring(Boolean(task.isRecurring));
      setRecurrenceRule(task.recurrenceRule || 'weekly');
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
      setDueTime('');
      setEstimatedEffort('1');
      setProjectId('');
      setJobId('');
      setTags('');
      setIsHardDeadline(false);
      setConsequencesOfDelay('');
      setIsRecurring(false);
      setRecurrenceRule('weekly');
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updatedTask: Task = {
      id: task?.id || `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      estimatedEffortHours: parseFloat(estimatedEffort) || 1,
      projectId: projectId || undefined,
      careerApplicationId: jobId || undefined,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      isHardDeadline,
      consequencesOfDelay: consequencesOfDelay.trim() || undefined,
      isRecurring,
      recurrenceRule: isRecurring ? recurrenceRule : undefined,
      postponedCount: task?.postponedCount || 0,
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: status === 'done' ? task?.completedAt || new Date().toISOString() : undefined,
    };

    onSaveTask(updatedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-[#111111] border border-[#252525] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222222] px-5 py-4 bg-[#0a0a0a]">
          <h3 className="text-sm font-bold text-white tracking-wide">
            {task ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">Task Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Update Docker configs for client deployment"
              className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key objectives, criteria for done, or reference links..."
              className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3.5 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 resize-none"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
              >
                <option value="inbox">Inbox</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                <Flag className="w-3.5 h-3.5 text-neutral-400" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Dates & Effort */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">Effort (Hours)</label>
              <input
                type="number"
                step="0.5"
                min="0.25"
                value={estimatedEffort}
                onChange={(e) => setEstimatedEffort(e.target.value)}
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          {/* Project & Job Linking */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                <FolderKanban className="w-3.5 h-3.5 text-neutral-400" />
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
              >
                <option value="">None (Standalone Task)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                Job Application
              </label>
              <select
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
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

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1 mb-1">
              <Tag className="w-3.5 h-3.5 text-neutral-400" />
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. backend, client, urgent"
              className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
            />
          </div>

          {/* Advanced / Planning Engine Inputs */}
          <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#222222] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-neutral-300" />
                <span className="text-xs font-bold text-neutral-200">Strict Hard Deadline</span>
              </div>
              <input
                type="checkbox"
                checked={isHardDeadline}
                onChange={(e) => setIsHardDeadline(e.target.checked)}
                className="w-4 h-4 rounded text-black bg-[#161616] border-[#333] accent-white"
              />
            </div>

            {isHardDeadline && (
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Consequences of Delay (used by Planning Engine)
                </label>
                <input
                  type="text"
                  value={consequencesOfDelay}
                  onChange={(e) => setConsequencesOfDelay(e.target.value)}
                  placeholder="e.g. Client milestone penalty, missed interview deadline"
                  className="w-full bg-[#111111] border border-[#262626] rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-neutral-400"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#1c1c1c]">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-neutral-300" />
                <span className="text-xs font-bold text-neutral-200">Recurring Task</span>
              </div>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 rounded text-black bg-[#161616] border-[#333] accent-white"
              />
            </div>

            {isRecurring && (
              <div className="flex items-center gap-3">
                <label className="text-xs text-neutral-400">Recurrence:</label>
                <select
                  value={recurrenceRule}
                  onChange={(e) => setRecurrenceRule(e.target.value as Task['recurrenceRule'])}
                  className="bg-[#111111] border border-[#262626] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-neutral-400"
                >
                  <option value="daily">Every day</option>
                  <option value="weekdays">Every weekday (Mon-Fri)</option>
                  <option value="weekly">Every week</option>
                  <option value="monthly">Every month</option>
                </select>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#222222]">
            {task && onDeleteTask ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this task?')) {
                    onDeleteTask(task.id);
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
                Save Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
