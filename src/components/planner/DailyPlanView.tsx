'use client';

import React, { useState, useMemo } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldAlert,
  Check,
  RotateCcw,
  Info,
} from 'lucide-react';
import { Task, Project, JobApplication, PlanningPreferences, DailyPlanProposal } from '@/types';
import { generateDailyPlanProposal } from '@/lib/planner';
import { getTodayDateString } from '@/lib/date-utils';

interface DailyPlanViewProps {
  tasks: Task[];
  projects: Project[];
  jobs: JobApplication[];
  preferences: PlanningPreferences;
  onSaveTask: (task: Task) => void;
  onToggleTask: (id: string) => void;
  onSavePreferences: (prefs: PlanningPreferences) => void;
}

export function DailyPlanView({
  tasks,
  projects,
  jobs,
  preferences,
  onSaveTask,
  onToggleTask,
  onSavePreferences,
}: DailyPlanViewProps) {
  const todayStr = getTodayDateString();
  const [isPlanApproved, setIsPlanApproved] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [, setReviewingTask] = useState<Task | null>(null);

  // Generate deterministic proposal
  const proposal: DailyPlanProposal = useMemo(() => {
    return generateDailyPlanProposal(tasks, jobs, projects, preferences, todayStr);
  }, [tasks, jobs, projects, preferences, todayStr]);

  // Initial selection of recommended tasks
  React.useEffect(() => {
    if (selectedTaskIds.length === 0 && proposal.recommendedTasks.length > 0) {
      setSelectedTaskIds(proposal.recommendedTasks.map((t) => t.id));
    }
  }, [proposal]);

  // Calculate chosen work capacity
  const chosenTasks = tasks.filter((t) => selectedTaskIds.includes(t.id));
  const totalEffort = chosenTasks.reduce((acc, t) => acc + (t.estimatedEffortHours || 1), 0);
  const capacity = preferences.dailyCapacityHours || 7.5;
  const isOverCapacity = totalEffort > capacity;

  const toggleTaskSelection = (id: string) => {
    if (selectedTaskIds.includes(id)) {
      setSelectedTaskIds(selectedTaskIds.filter((tId) => tId !== id));
    } else {
      setSelectedTaskIds([...selectedTaskIds, id]);
    }
  };

  const handleApprovePlan = () => {
    // Stamp approved tasks with order
    chosenTasks.forEach((t, idx) => {
      onSaveTask({
        ...t,
        isRecommendedToday: true,
        manualPlanOrder: idx + 1,
      });
    });
    setIsPlanApproved(true);
  };

  const deferTaskToTomorrow = (task: Task) => {
    onSaveTask({
      ...task,
      dueDate: '2026-10-17',
      postponedCount: (task.postponedCount || 0) + 1,
      updatedAt: new Date().toISOString(),
    });
    setReviewingTask(null);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1a1a1a] text-white flex items-center justify-center border border-[#2a2a2a]">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Daily Planning Engine
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Deterministic, explainable daily task recommendations based on hard deadlines, effort, and capacity.
          </p>
        </div>

        {/* Approval Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleApprovePlan}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-sm active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isPlanApproved ? 'Plan Approved & Locked ✓' : "Approve Today's Plan"}</span>
          </button>
        </div>
      </div>

      {/* Capacity & Effort Gauge */}
      <div className="p-5 rounded-2xl bg-[#111111] border border-[#222222] shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" />
            <span className="font-bold text-white">Daily Capacity Allocation</span>
            <span className="text-neutral-400">({preferences.userName}&apos;s schedule)</span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span
              className={`font-bold text-sm ${
                isOverCapacity ? 'text-white underline' : 'text-neutral-200'
              }`}
            >
              {totalEffort.toFixed(1)} hrs selected
            </span>
            <span className="text-neutral-400">/ {capacity} hrs limit</span>
          </div>
        </div>

        {/* Meter */}
        <div className="w-full bg-[#1a1a1a] h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-white"
            style={{ width: `${Math.min(100, (totalEffort / capacity) * 100)}%` }}
          />
        </div>

        {isOverCapacity && (
          <div className="p-3 rounded-xl bg-[#161616] border border-[#333333] flex items-center gap-2 text-xs text-neutral-200">
            <AlertTriangle className="w-4 h-4 text-white shrink-0" />
            <span>
              Capacity Warning: Planned tasks ({totalEffort.toFixed(1)}h) exceed your daily limit of{' '}
              {capacity}h. Consider deferring non-urgent work to maintain focus.
            </span>
          </div>
        )}
      </div>

      {/* Unfinished / Postponed Tasks Review (if any) */}
      {proposal.postponedTasksForReview.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#111111] border border-[#262626] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <RotateCcw className="w-4 h-4" />
              <span>Unfinished Tasks Reassessment</span>
            </div>
            <span className="text-[10px] text-neutral-300 bg-[#1c1c1c] border border-[#2a2a2a] px-2 py-0.5 rounded-full font-mono">
              {proposal.postponedTasksForReview.length} items flagged
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Orbit avoids blindly rescheduling tasks forever. The following tasks were postponed multiple times:
          </p>

          <div className="space-y-2">
            {proposal.postponedTasksForReview.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0c0c0c] border border-[#222222]"
              >
                <div>
                  <h4 className="text-xs font-bold text-neutral-200">{t.title}</h4>
                  <p className="text-[10px] text-neutral-400 font-medium mt-0.5">
                    Postponed {t.postponedCount} times • {t.consequencesOfDelay || 'No consequences noted'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deferTaskToTomorrow(t)}
                    className="px-2.5 py-1 rounded-lg bg-[#1a1a1a] hover:bg-neutral-800 text-xs text-neutral-200 border border-[#2b2b2b] transition-colors"
                  >
                    Reschedule to Tomorrow
                  </button>
                  <button
                    onClick={() => {
                      onSaveTask({ ...t, status: 'cancelled' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#161616] hover:bg-neutral-800 text-xs text-neutral-400 border border-[#262626] transition-colors"
                  >
                    Cancel Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sections: 1. Urgent Commitments */}
      <div className="rounded-2xl bg-[#111111] border border-[#222222] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1c1c1c] text-white flex items-center justify-center border border-[#2a2a2a]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                1. Urgent Commitments & Hard Deadlines ({proposal.urgentCommitments.length})
              </h3>
              <p className="text-[11px] text-neutral-400">
                Non-negotiable deadlines, overdue tasks, and direct recruiter follow-ups.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {proposal.urgentCommitments.length === 0 ? (
            <p className="text-xs text-neutral-500 py-3">No overdue or critical deadlines today.</p>
          ) : (
            proposal.urgentCommitments.map((t) => {
              const isSelected = selectedTaskIds.includes(t.id);
              return (
                <div
                  key={t.id}
                  onClick={() => toggleTaskSelection(t.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#151515] border-white/60'
                      : 'bg-[#0c0c0c] border-[#222222] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-white border-white text-black'
                          : 'border-neutral-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-100">{t.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-neutral-300 font-semibold flex items-center gap-1">
                          <Info className="w-3 h-3 text-neutral-400" />
                          {t.recommendationReason}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {t.estimatedEffortHours}h effort
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white text-black border border-white">
                    {t.priority}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Sections: 2. Recommended High-Value Work */}
      <div className="rounded-2xl bg-[#111111] border border-[#222222] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1c1c1c] text-white flex items-center justify-center border border-[#2a2a2a]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                2. Recommended High-Value Work ({proposal.recommendedWork.length})
              </h3>
              <p className="text-[11px] text-neutral-400">
                Core development sprints and strategic goals fitted into your remaining capacity.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {proposal.recommendedWork.map((t) => {
            const isSelected = selectedTaskIds.includes(t.id);
            return (
              <div
                key={t.id}
                onClick={() => toggleTaskSelection(t.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#151515] border-white/60'
                    : 'bg-[#0c0c0c] border-[#222222] opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-white border-white text-black'
                        : 'border-neutral-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-100">{t.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-neutral-300 font-semibold flex items-center gap-1">
                        <Info className="w-3 h-3 text-neutral-400" />
                        {t.recommendationReason}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {t.estimatedEffortHours}h effort
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#1f1f1f] text-neutral-200 border border-[#2d2d2d]">
                  {t.priority}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sections: 3. Scheduled Routines & Habits */}
      <div className="rounded-2xl bg-[#111111] border border-[#222222] p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1c1c1c] text-white flex items-center justify-center border border-[#2a2a2a]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              3. Routines & Recurring Habits ({proposal.routineTasks.length})
            </h3>
            <p className="text-[11px] text-neutral-400">
              Health, wellness, and career search habits scheduled for today.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {proposal.routineTasks.map((t) => {
            const isSelected = selectedTaskIds.includes(t.id);
            return (
              <div
                key={t.id}
                onClick={() => toggleTaskSelection(t.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#151515] border-white/60'
                    : 'bg-[#0c0c0c] border-[#222222] opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-white border-white text-black'
                        : 'border-neutral-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-100">{t.title}</h4>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {t.dueTime || 'Recurring'} • {t.estimatedEffortHours}h effort
                    </span>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#181818] text-neutral-300 border border-[#252525]">
                  Routine
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
