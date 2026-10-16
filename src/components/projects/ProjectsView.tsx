'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Calendar,
  ExternalLink,
  GitBranch,
  Check,
  Edit2,
  Trash2,
  X,
  ArrowLeft,
  Clock,
  Layers,
} from 'lucide-react';
import { Project, Task, Priority, ProjectStatus } from '@/types';
import { formatFriendlyDate } from '@/lib/date-utils';

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  onSaveProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onSaveTask: (task: Task) => void;
  onToggleTask: (taskId: string) => void;
  initialSelectedProjectId?: string | null;
}

const MONO_SHADES = ['#FFFFFF', '#D4D4D4', '#A3A3A3', '#737373', '#404040'];

export function ProjectsView({
  projects,
  tasks,
  onSaveProject,
  onDeleteProject,
  onSaveTask,
  onToggleTask,
  initialSelectedProjectId,
}: ProjectsViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    initialSelectedProjectId || null
  );
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states for project modal
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('in_progress');
  const [priority, setPriority] = useState<Priority>('high');
  const [deadline, setDeadline] = useState('');
  const [color, setColor] = useState('#FFFFFF');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Selected project details
  const activeProject = projects.find((p) => p.id === selectedProjectId);
  const activeProjectTasks = tasks.filter((t) => t.projectId === selectedProjectId);

  const getProgress = (p: Project) => {
    const pTasks = tasks.filter((t) => t.projectId === p.id);
    if (pTasks.length > 0) {
      const done = pTasks.filter((t) => t.status === 'done').length;
      return Math.round((done / pTasks.length) * 100);
    }
    if (p.milestones && p.milestones.length > 0) {
      const doneM = p.milestones.filter((m) => m.completed).length;
      return Math.round((doneM / p.milestones.length) * 100);
    }
    return 0;
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setName('');
    setDescription('');
    setStatus('in_progress');
    setPriority('high');
    setDeadline('');
    setColor('#FFFFFF');
    setRepoUrl('');
    setLiveUrl('');
    setNotes('');
    setIsProjectModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setName(p.name);
    setDescription(p.description);
    setStatus(p.status);
    setPriority(p.priority);
    setDeadline(p.deadline || '');
    setColor(p.color || '#FFFFFF');
    setRepoUrl(p.repoUrl || '');
    setLiveUrl(p.liveUrl || '');
    setNotes(p.notes || '');
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const projectToSave: Project = {
      id: editingProject?.id || `proj-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      status,
      priority,
      deadline: deadline || undefined,
      color,
      repoUrl: repoUrl.trim() || undefined,
      liveUrl: liveUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      milestones: editingProject?.milestones || [],
      createdAt: editingProject?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveProject(projectToSave);
    setIsProjectModalOpen(false);
  };

  const toggleMilestone = (milestoneId: string) => {
    if (!activeProject) return;
    const updatedMilestones = activeProject.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    onSaveProject({
      ...activeProject,
      milestones: updatedMilestones,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {selectedProjectId && (
            <button
              onClick={() => setSelectedProjectId(null)}
              className="p-2 rounded-xl bg-[#111111] border border-[#222222] text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {activeProject ? activeProject.name : 'Projects & Workspaces'}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {activeProject
                ? activeProject.description
                : 'Centralized development workspaces with live progress tracking.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeProject && (
            <button
              onClick={() => openEditModal(activeProject)}
              className="px-3 py-2 rounded-xl bg-[#111111] border border-[#222222] text-neutral-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Workspace
            </button>
          )}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-sm active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* View: Project Details OR Project Grid */}
      {activeProject ? (
        /* WORKSPACE DETAIL VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Linked Tasks & Milestones */}
          <div className="lg:col-span-2 space-y-6">
            {/* Linked Tasks */}
            <div className="rounded-2xl bg-[#111111] border border-[#222222] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-neutral-300" />
                  Workspace Tasks ({activeProjectTasks.length})
                </h3>
                <span className="text-xs font-mono font-bold text-neutral-400">
                  {activeProjectTasks.filter((t) => t.status === 'done').length} Done
                </span>
              </div>

              <div className="space-y-2">
                {activeProjectTasks.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-500">
                    No tasks linked to this project yet. Use Quick Capture or Tasks view to assign tasks.
                  </div>
                ) : (
                  activeProjectTasks.map((t) => {
                    const isDone = t.status === 'done';
                    return (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#0c0c0c] border border-[#222222] hover:border-[#383838] transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            onClick={() => onToggleTask(t.id)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                              isDone
                                ? 'bg-white border-white text-black'
                                : 'border-neutral-600 hover:border-neutral-300'
                            }`}
                          >
                            {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                          <span
                            className={`text-xs font-semibold truncate ${
                              isDone ? 'line-through text-neutral-500' : 'text-neutral-200'
                            }`}
                          >
                            {t.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {t.dueDate && (
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {formatFriendlyDate(t.dueDate)}
                            </span>
                          )}
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#1a1a1a] text-neutral-300 border border-[#282828]">
                            {t.priority}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Milestones */}
            <div className="rounded-2xl bg-[#111111] border border-[#222222] p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white" />
                Project Milestones
              </h3>

              <div className="space-y-2">
                {activeProject.milestones && activeProject.milestones.length > 0 ? (
                  activeProject.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(m.id)}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#0c0c0c] border border-[#222222] hover:border-[#383838] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            m.completed
                              ? 'bg-white border-white text-black'
                              : 'border-neutral-600'
                          }`}
                        >
                          {m.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            m.completed ? 'line-through text-neutral-500' : 'text-neutral-200'
                          }`}
                        >
                          {m.title}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-neutral-400">{m.dueDate}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500 py-2">No milestones defined yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Col: Metadata, Links, Notes */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#111111] border border-[#222222] p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Workspace Info
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-neutral-500 block mb-1">Overall Progress</span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-[#1a1a1a] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-500"
                        style={{ width: `${getProgress(activeProject)}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-white">
                      {getProgress(activeProject)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-[#1c1c1c]">
                  <span className="text-neutral-400">Target Deadline</span>
                  <span className="text-white font-mono">{activeProject.deadline || 'Flexible'}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-[#1c1c1c]">
                  <span className="text-neutral-400">Status</span>
                  <span className="text-white capitalize">{activeProject.status.replace('_', ' ')}</span>
                </div>

                {activeProject.repoUrl && (
                  <div className="pt-2 border-t border-[#1c1c1c]">
                    <a
                      href={activeProject.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white hover:text-neutral-300 transition-colors"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>GitHub Repository</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-neutral-500" />
                    </a>
                  </div>
                )}

                {activeProject.liveUrl && (
                  <div>
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white hover:text-neutral-300 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Production URL</span>
                    </a>
                  </div>
                )}
              </div>

              {activeProject.notes && (
                <div className="pt-3 border-t border-[#1c1c1c]">
                  <h4 className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Workspace Notes</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed bg-[#0c0c0c] p-3 rounded-xl border border-[#222222]">
                    {activeProject.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* PROJECTS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map((p) => {
            const progress = getProgress(p);
            const pTasks = tasks.filter((t) => t.projectId === p.id);

            return (
              <div
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className="p-5 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#383838] transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white bg-[#1a1a1a] border border-[#2a2a2a]">
                      <FolderKanban className="w-5 h-5 text-neutral-200" />
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#1a1a1a] text-neutral-300 border border-[#282828]">
                      {p.priority}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-neutral-200 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#1c1c1c]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">{pTasks.length} Tasks</span>
                    <span className="font-mono font-bold text-white">{progress}%</span>
                  </div>
                  <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#111111] border border-[#252525] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#222222] px-5 py-4 bg-[#0a0a0a]">
              <h3 className="text-sm font-bold text-white">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Genesis Real Estate"
                  className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of project goals..."
                  className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-400 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-400 block mb-1">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-400 block mb-1">Monochrome Shade</label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {MONO_SHADES.map((shade) => (
                      <button
                        key={shade}
                        type="button"
                        onClick={() => setColor(shade)}
                        className={`w-6 h-6 rounded-lg border transition-all ${
                          color.toLowerCase() === shade.toLowerCase()
                            ? 'border-white scale-110 shadow-sm'
                            : 'border-[#333] opacity-75'
                        }`}
                        style={{ backgroundColor: shade }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-400 block mb-1">Repository URL</label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-400 block mb-1">Live URL</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#222222]">
                {editingProject ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Delete this project? Linked tasks will not be deleted.')) {
                        onDeleteProject(editingProject.id);
                        setIsProjectModalOpen(false);
                        setSelectedProjectId(null);
                      }
                    }}
                    className="text-xs text-neutral-400 hover:text-white font-semibold transition-colors"
                  >
                    Delete Project
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all shadow-sm"
                  >
                    Save Project
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
