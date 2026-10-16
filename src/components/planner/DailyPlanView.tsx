'use client';

import React, { useState, useMemo } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame,
  Check,
  RotateCcw,
  Calendar,
  Sliders,
  ChevronDown,
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
  const [reviewingTask, setReviewingTask] = useState<Task | null>(null);

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
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Daily Planning Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic, explainable daily task recommendations based on hard deadlines, effort, and capacity.
          </p>
        </div>

        {/* Approval Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleApprovePlan}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 ${
              isPlanApproved
                ? 'bg-emerald-600 text-white shadow-emerald-600/25'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isPlanApproved ? 'Plan Approved & Locked ✓' : 'Approve Today\'s Plan'}</span>
          </button>
        </div>
      </div>

      {/* Capacity & Effort Gauge */}
      <div className="p-5 rounded-2xl bg-[#0d1322] border border-[#1a253c] shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white">Daily Capacity Allocation</span>
            <span className="text-slate-400">({preferences.userName}&apos;s schedule)</span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span
              className={`font-bold text-sm ${
                isOverCapacity ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {totalEffort.toFixed(1)} hrs selected
            </span>
            <span className="text-slate-400">/ {capacity} hrs limit</span>
          </div>
        </div>

        {/* Meter */}
        <div className="w-full bg-[#162035] h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverCapacity ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-emerald-400'
            }`}
            style={{ width: `${Math.min(100, (totalEffort / capacity) * 100)}%` }}
          />
        </div>

        {isOverCapacity && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Capacity Warning: Planned tasks ({totalEffort.toFixed(1)}h) exceed your daily limit of{' '}
              {capacity}h. Consider deferring non-urgent work to maintain focus.
            </span>
          </div>
        )}
      </div>

      {/* Unfinished / Postponed Tasks Review (if any) */}
      {proposal.postponedTasksForReview.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <RotateCcw className="w-4 h-4" />
              <span>Unfinished Tasks Reassessment</span>
            </div>
            <span className="text-[10px] text-amber-300/80 bg-amber-500/20 px-2 py-0.5 rounded-full font-mono">
              {proposal.postponedTasksForReview.length} items flagged
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Orbit avoids blindly rescheduling tasks forever. The following tasks were postponed multiple times:
          </p>

          <div className="space-y-2">
            {proposal.postponedTasksForReview.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#090e18] border border-amber-500/20"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{t.title}</h4>
                  <p className="text-[10px] text-amber-400 font-medium mt-0.5">
                    Postponed {t.postponedCount} times • {t.consequencesOfDelay || 'No consequences noted'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deferTaskToTomorrow(t)}
                    className="px-2.5 py-1 rounded-lg bg-[#162035] hover:bg-[#1f2d48] text-xs text-slate-300 transition-colors"
                  >
                    Reschedule to Tomorrow
                  </button>
                  <button
                    onClick={() => {
                      onSaveTask({ ...t, status: 'cancelled' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-xs text-rose-300 transition-colors"
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
      <div className="rounded-2xl bg-[#0d1322] border border-[#1a253c] p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                1. Urgent Commitments & Hard Deadlines ({proposal.urgentCommitments.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                Non-negotiable deadlines, overdue tasks, and direct recruiter follow-ups.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {proposal.urgentCommitments.length === 0 ? (
            <p className="text-xs text-slate-500 py-3">No overdue or critical deadlines today.</p>
          ) : (
            proposal.urgentCommitments.map((t) => {
              const isSelected = selectedTaskIds.includes(t.id);
              return (
                <div
                  key={t.id}
                  onClick={() => toggleTaskSelection(t.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0f172a] border-blue-500/50'
                      : 'bg-[#0a0f1c] border-[#172238] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{t.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          {t.recommendationReason}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {t.estimatedEffortHours}h effort
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    {t.priority}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Sections: 2. Recommended High-Value Work */}
      <div className="rounded-2xl bg-[#0d1322] border border-[#1a253c] p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                2. Recommended High-Value Work ({proposal.recommendedWork.length})
              </h3>
              <p className="text-[11px] text-slate-400">
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
                    ? 'bg-[#0f172a] border-blue-500/50'
                    : 'bg-[#0a0f1c] border-[#172238] opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{t.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-blue-300 font-semibold flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        {t.recommendationReason}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {t.estimatedEffortHours}h effort
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  {t.priority}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sections: 3. Scheduled Routines & Habits */}
      <div className="rounded-2xl bg-[#0d1322] border border-[#1a253c] p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              3. Routines & Recurring Habits ({proposal.routineTasks.length})
            </h3>
            <p className="text-[11px] text-slate-400">
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
                    ? 'bg-[#0f172a] border-teal-500/50'
                    : 'bg-[#0a0f1c] border-[#172238] opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-teal-600 border-teal-500 text-white'
                        : 'border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{t.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {t.dueTime || 'Recurring'} • {t.estimatedEffortHours}h effort
                    </span>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30">
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
