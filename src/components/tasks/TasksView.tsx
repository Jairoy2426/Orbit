'use client';

import React, { useState } from 'react';
import {
  Plus,
  Kanban,
  List,
  Calendar,
  AlertTriangle,
  Clock,
  Search,
  Check,
  ChevronRight,
  MoreHorizontal,
  Flag,
  FolderKanban,
  Briefcase,
} from 'lucide-react';
import { Task, Project, JobApplication, TaskStatus, Priority } from '@/types';
import { getTodayDateString, formatFriendlyDate } from '@/lib/date-utils';

interface TasksViewProps {
  tasks: Task[];
  projects: Project[];
  jobs: JobApplication[];
  onSaveTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onOpenTaskModal: (task?: Task) => void;
}

type TaskTab = 'kanban' | 'list' | 'today' | 'upcoming' | 'overdue';

const KANBAN_COLUMNS: { id: TaskStatus; label: string; dotClass: string }[] = [
  { id: 'inbox', label: 'Inbox', dotClass: 'border-neutral-500 bg-neutral-700' },
  { id: 'todo', label: 'To Do', dotClass: 'border-neutral-400 bg-neutral-500' },
  { id: 'in_progress', label: 'In Progress', dotClass: 'border-white bg-white' },
  { id: 'blocked', label: 'Blocked', dotClass: 'border-neutral-600 bg-neutral-800' },
  { id: 'done', label: 'Done', dotClass: 'border-neutral-300 bg-neutral-200' },
];

export function TasksView({
  tasks,
  projects,
  jobs,
  onSaveTask,
  onDeleteTask,
  onToggleTask,
  onOpenTaskModal,
}: TasksViewProps) {
  const [activeTab, setActiveTab] = useState<TaskTab>('kanban');
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const todayStr = getTodayDateString();

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedProject !== 'all' && t.projectId !== selectedProject) return false;
    if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;

    if (activeTab === 'today') {
      return t.dueDate === todayStr;
    }
    if (activeTab === 'overdue') {
      return t.status !== 'done' && t.dueDate && t.dueDate < todayStr;
    }
    if (activeTab === 'upcoming') {
      return t.status !== 'done' && t.dueDate && t.dueDate > todayStr;
    }
    return true;
  });

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'critical':
      case 'high':
        return 'text-black bg-white border-white font-bold';
      case 'medium':
        return 'text-neutral-200 bg-[#262626] border-[#383838]';
      case 'low':
      default:
        return 'text-neutral-400 bg-[#161616] border-[#252525]';
    }
  };

  const moveTaskStatus = (task: Task, newStatus: TaskStatus) => {
    onSaveTask({
      ...task,
      status: newStatus,
      completedAt: newStatus === 'done' ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Task Management</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Organize, prioritize, and track tasks across projects and career goals.
          </p>
        </div>

        <button
          onClick={() => onOpenTaskModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-sm active:scale-95 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and View Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-2xl bg-[#111111] border border-[#222222]">
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'kanban'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Kanban
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            List
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'today'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Today
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overdue'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Overdue
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter tasks..."
              className="bg-[#0c0c0c] border border-[#222222] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-[#0c0c0c] border border-[#222222] rounded-xl px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-neutral-400"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-[#0c0c0c] border border-[#222222] rounded-xl px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-neutral-400"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Main View Display */}
      {activeTab === 'kanban' ? (
        /* KANBAN BOARD */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl bg-[#111111] border border-[#222222] p-3 min-w-[240px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#1c1c1c]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full border ${col.dotClass}`} />
                    <span className="text-xs font-bold text-white tracking-wide">{col.label}</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#181818] text-neutral-400 border border-[#252525] font-bold">
                    {colTasks.length}
                  </span>
                </div>

                {/* Task Cards in Column */}
                <div className="space-y-2.5 flex-1 min-h-[350px]">
                  {colTasks.map((t) => {
                    const isDone = t.status === 'done';
                    const project = projects.find((p) => p.id === t.projectId);
                    const job = jobs.find((j) => j.id === t.careerApplicationId);

                    return (
                      <div
                        key={t.id}
                        className="group p-3 rounded-xl bg-[#0c0c0c] border border-[#222222] hover:border-[#383838] transition-all cursor-pointer shadow-sm space-y-2"
                        onClick={() => onOpenTaskModal(t)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`text-xs font-semibold leading-snug ${
                              isDone ? 'line-through text-neutral-500' : 'text-neutral-200'
                            }`}
                          >
                            {t.title}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleTask(t.id);
                            }}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${
                              isDone
                                ? 'bg-white border-white text-black'
                                : 'border-neutral-600 hover:border-neutral-300'
                            }`}
                          >
                            {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                        </div>

                        {/* Project / Career pill */}
                        {(project || job) && (
                          <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                            {project && (
                              <span className="px-1.5 py-0.5 rounded font-medium bg-[#1a1a1a] text-neutral-300 border border-[#282828] truncate max-w-[140px]">
                                {project.name}
                              </span>
                            )}
                            {job && (
                              <span className="px-1.5 py-0.5 rounded font-medium bg-[#1a1a1a] text-neutral-300 border border-[#282828] truncate max-w-[140px]">
                                {job.company}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Card Footer */}
                        <div className="flex items-center justify-between pt-1 border-t border-[#1a1a1a] text-[10px]">
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold uppercase border ${getPriorityBadge(
                              t.priority
                            )}`}
                          >
                            {t.priority}
                          </span>

                          {t.dueDate && (
                            <span
                              className={`font-mono font-medium ${
                                t.dueDate < todayStr && !isDone
                                  ? 'text-neutral-200 font-bold underline'
                                  : 'text-neutral-400'
                              }`}
                            >
                              {formatFriendlyDate(t.dueDate)}
                            </span>
                          )}
                        </div>

                        {/* Quick move buttons */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-1 flex items-center justify-between border-t border-[#1a1a1a]">
                          <span className="text-[9px] text-neutral-500">Move:</span>
                          <div className="flex items-center gap-1">
                            {KANBAN_COLUMNS.filter((c) => c.id !== t.status).map((c) => (
                              <button
                                key={c.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveTaskStatus(t, c.id);
                                }}
                                className="px-1.5 py-0.5 rounded bg-[#181818] text-[9px] text-neutral-400 hover:text-white hover:bg-neutral-800 border border-[#242424] transition-colors"
                              >
                                {c.label.slice(0, 3)}
                              </button>
                            ))}
                          </div>
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
        /* LIST / FILTERED VIEW */
        <div className="rounded-2xl bg-[#111111] border border-[#222222] p-4 space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              No tasks match the active filters or view.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isDone = task.status === 'done';
              const project = projects.find((p) => p.id === task.projectId);
              const job = jobs.find((j) => j.id === task.careerApplicationId);

              return (
                <div
                  key={task.id}
                  onClick={() => onOpenTaskModal(task)}
                  className="p-3 rounded-xl bg-[#0c0c0c] border border-[#222222] hover:border-[#383838] transition-all cursor-pointer group flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(task.id);
                      }}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        isDone
                          ? 'bg-white border-white text-black'
                          : 'border-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <span
                        className={`text-xs md:text-sm font-semibold truncate block ${
                          isDone ? 'line-through text-neutral-500' : 'text-neutral-100'
                        }`}
                      >
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-400">
                        {project && <span>{project.name}</span>}
                        {job && <span>{job.company}</span>}
                        {task.description && (
                          <span className="truncate max-w-xs opacity-75">{task.description}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getPriorityBadge(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>

                    {task.dueDate && (
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {formatFriendlyDate(task.dueDate)}
                      </span>
                    )}

                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#1a1a1a] text-neutral-300 border border-[#2a2a2a] font-medium capitalize">
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
