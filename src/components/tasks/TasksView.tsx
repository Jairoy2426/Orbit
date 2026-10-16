'use client';

import React, { useState } from 'react';
import {
  Plus,
  Kanban,
  List,
  Calendar,
  AlertTriangle,
  Clock,
  Filter,
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

const KANBAN_COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'inbox', label: 'Inbox', color: 'border-slate-500' },
  { id: 'todo', label: 'To Do', color: 'border-blue-500' },
  { id: 'in_progress', label: 'In Progress', color: 'border-amber-500' },
  { id: 'blocked', label: 'Blocked', color: 'border-rose-500' },
  { id: 'done', label: 'Done', color: 'border-emerald-500' },
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
        return 'text-red-400 bg-red-500/15 border-red-500/30';
      case 'high':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
      case 'medium':
        return 'text-blue-400 bg-blue-500/15 border-blue-500/30';
      case 'low':
      default:
        return 'text-slate-400 bg-slate-500/15 border-slate-500/30';
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
          <p className="text-xs text-slate-400 mt-0.5">
            Organize, prioritize, and track tasks across projects and career goals.
          </p>
        </div>

        <button
          onClick={() => onOpenTaskModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and View Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-2xl bg-[#0d1322] border border-[#1a253c]">
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'kanban'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#162035]'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Kanban
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#162035]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            List
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'today'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#162035]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Today
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#162035]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overdue'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#162035]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Overdue
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter tasks..."
              className="bg-[#0a0f1c] border border-[#1e2a44] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
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
            className="bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
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
                className="flex flex-col rounded-2xl bg-[#0a0f1c] border border-[#172238] p-3 min-w-[240px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#151f33]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full border-2 ${col.color}`} />
                    <span className="text-xs font-bold text-white tracking-wide">{col.label}</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#131d33] text-slate-400 font-bold">
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
                        className="group p-3 rounded-xl bg-[#0d1322] border border-[#1c273e] hover:border-[#2b3c61] transition-all cursor-pointer shadow-sm space-y-2"
                        onClick={() => onOpenTaskModal(t)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`text-xs font-semibold leading-snug ${
                              isDone ? 'line-through text-slate-500' : 'text-slate-200'
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
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : 'border-slate-600 hover:border-blue-400'
                            }`}
                          >
                            {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                        </div>

                        {/* Project / Career pill */}
                        {(project || job) && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            {project && (
                              <span
                                className="px-1.5 py-0.5 rounded font-medium truncate max-w-[140px]"
                                style={{
                                  backgroundColor: `${project.color}15`,
                                  color: project.color,
                                }}
                              >
                                {project.name}
                              </span>
                            )}
                            {job && (
                              <span className="px-1.5 py-0.5 rounded font-medium bg-purple-500/15 text-purple-400 truncate max-w-[140px]">
                                {job.company}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Card Footer */}
                        <div className="flex items-center justify-between pt-1 border-t border-[#151f33] text-[10px]">
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
                                  ? 'text-rose-400 font-bold'
                                  : 'text-slate-400'
                              }`}
                            >
                              {formatFriendlyDate(t.dueDate)}
                            </span>
                          )}
                        </div>

                        {/* Quick move buttons */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-1 flex items-center justify-between border-t border-[#131d33]">
                          <span className="text-[9px] text-slate-500">Move:</span>
                          <div className="flex items-center gap-1">
                            {KANBAN_COLUMNS.filter((c) => c.id !== t.status).map((c) => (
                              <button
                                key={c.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveTaskStatus(t, c.id);
                                }}
                                className="px-1.5 py-0.5 rounded bg-[#162035] text-[9px] text-slate-400 hover:text-white hover:bg-blue-600 transition-colors"
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
        <div className="rounded-2xl bg-[#0d1322] border border-[#1a253c] p-4 space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
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
                  className="p-3 rounded-xl bg-[#0a0f1c] border border-[#172238] hover:border-[#273756] transition-all cursor-pointer group flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(task.id);
                      }}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        isDone
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'border-slate-600 hover:border-blue-400'
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <span
                        className={`text-xs md:text-sm font-semibold truncate block ${
                          isDone ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
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
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatFriendlyDate(task.dueDate)}
                      </span>
                    )}

                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#162035] text-slate-300 font-medium capitalize">
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
