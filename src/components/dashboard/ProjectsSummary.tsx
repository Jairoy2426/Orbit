'use client';

import React from 'react';
import { FolderKanban, Plus, ArrowRight, Layers } from 'lucide-react';
import { Project, Task } from '@/types';

interface ProjectsSummaryProps {
  projects: Project[];
  tasks: Task[];
  onViewAllProjects: () => void;
  onNewProject: () => void;
  onSelectProject: (projectId: string) => void;
}

export function ProjectsSummary({
  projects,
  tasks,
  onViewAllProjects,
  onNewProject,
  onSelectProject,
}: ProjectsSummaryProps) {
  const getProjectProgress = (project: Project) => {
    const projectTasks = tasks.filter((t) => t.projectId === project.id);
    if (projectTasks.length > 0) {
      const done = projectTasks.filter((t) => t.status === 'done').length;
      return Math.round((done / projectTasks.length) * 100);
    }
    if (project.milestones && project.milestones.length > 0) {
      const doneM = project.milestones.filter((m) => m.completed).length;
      return Math.round((doneM / project.milestones.length) * 100);
    }
    return 50;
  };

  return (
    <div className="rounded-2xl bg-[#111111] border border-[#222222] p-4 md:p-5 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] text-white flex items-center justify-center border border-[#2a2a2a]">
            <FolderKanban className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wide">Projects</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewAllProjects}
            className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNewProject}
            className="p-1 rounded-md text-neutral-500 hover:text-white hover:bg-[#1a1a1a] transition-colors"
            title="Create Project"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {projects.slice(0, 4).map((p) => {
          const progress = getProjectProgress(p);

          return (
            <div
              key={p.id}
              onClick={() => onSelectProject(p.id)}
              className="p-3 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] hover:border-[#333333] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center shrink-0 text-white">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-neutral-200 group-hover:text-white transition-colors truncate">
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-neutral-500 truncate">{p.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-neutral-300">{progress}%</span>
                </div>
              </div>

              {/* Monochrome Progress Bar */}
              <div className="w-full bg-[#1c1c1c] h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-white"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
