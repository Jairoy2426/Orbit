'use client';

import React from 'react';
import { FolderKanban, Plus, ArrowRight, ExternalLink } from 'lucide-react';
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
  // Calculate progress % based on linked tasks or milestones
  const getProjectProgress = (project: Project) => {
    const projectTasks = tasks.filter((t) => t.projectId === project.id);
    if (projectTasks.length > 0) {
      const done = projectTasks.filter((t) => t.status === 'done').length;
      return Math.round((done / projectTasks.length) * 100);
    }
    // Fallback to milestones
    if (project.milestones && project.milestones.length > 0) {
      const doneM = project.milestones.filter((m) => m.completed).length;
      return Math.round((doneM / project.milestones.length) * 100);
    }
    return 50;
  };

  return (
    <div className="rounded-2xl bg-[#0d1322] border border-[#1a253c] p-4 md:p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <FolderKanban className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wide">Projects</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewAllProjects}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNewProject}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#162035] transition-colors"
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
              className="p-3 rounded-xl bg-[#0a0f1c] border border-[#172238] hover:border-[#273756] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: p.color || '#3b82f6' }}
                  />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">{p.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-300">{progress}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#162035] h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: p.color || '#3b82f6',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
