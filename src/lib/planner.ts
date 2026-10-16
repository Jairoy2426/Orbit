import { Task, JobApplication, Project, PlanningPreferences, DailyPlanProposal } from '@/types';
import { getTodayDateString } from './date-utils';
import { parseISO, isBefore, isSameDay } from 'date-fns';

export function scoreTaskUrgency(
  task: Task,
  jobs: JobApplication[],
  projects: Project[],
  todayStr = getTodayDateString()
): { score: number; reason: string } {
  let score = 0;
  const reasons: string[] = [];

  const today = parseISO(todayStr);

  // 1. Due date & overdue checks
  if (task.dueDate) {
    try {
      const due = parseISO(task.dueDate);
      if (isBefore(due, today)) {
        score += 45;
        reasons.push('Overdue commitment');
      } else if (isSameDay(due, today)) {
        score += 35;
        reasons.push('Deadline is today');
      } else {
        score += 15;
      }
    } catch {
      // fallback
    }
  }

  // 2. Priority weight
  switch (task.priority) {
    case 'critical':
      score += 35;
      reasons.push('Critical priority');
      break;
    case 'high':
      score += 25;
      reasons.push('High priority');
      break;
    case 'medium':
      score += 15;
      break;
    case 'low':
      score += 5;
      break;
  }

  // 3. Hard deadline vs flexible
  if (task.isHardDeadline) {
    score += 15;
    reasons.push('Strict hard deadline');
  }

  // 4. Career follow-up link
  if (task.careerApplicationId) {
    const job = jobs.find((j) => j.id === task.careerApplicationId);
    if (job) {
      if (job.status === 'follow_up_due' || job.status === 'interview') {
        score += 20;
        reasons.push(`Job follow-up for ${job.company}`);
      }
    }
  }

  // 5. Project milestone link
  if (task.projectId) {
    const proj = projects.find((p) => p.id === task.projectId);
    if (proj) {
      const hasMilestoneSoon = proj.milestones.some((m) => !m.completed && m.dueDate <= todayStr);
      if (hasMilestoneSoon) {
        score += 15;
        reasons.push(`Blocks milestone for ${proj.name}`);
      }
    }
  }

  // 6. Postponed penalty/review
  if (task.postponedCount && task.postponedCount >= 2) {
    score += 10;
    reasons.push(`Postponed ${task.postponedCount} times`);
  }

  // 7. Recurring tasks for today
  if (task.isRecurring) {
    score += 10;
    reasons.push('Recurring scheduled habit');
  }

  const primaryReason = reasons.slice(0, 2).join(' • ') || 'Scheduled priority';

  return {
    score,
    reason: primaryReason,
  };
}

export function generateDailyPlanProposal(
  tasks: Task[],
  jobs: JobApplication[],
  projects: Project[],
  preferences: PlanningPreferences,
  targetDateStr = getTodayDateString()
): DailyPlanProposal {
  const activeTasks = tasks.filter((t) => t.status !== 'done' && t.status !== 'cancelled');

  const scoredTasks = activeTasks.map((task) => {
    const { score, reason } = scoreTaskUrgency(task, jobs, projects, targetDateStr);
    return {
      task: {
        ...task,
        recommendationReason: task.recommendationReason || reason,
      },
      score,
      reason,
    };
  });

  // Sort descending by score
  scoredTasks.sort((a, b) => {
    if (a.task.manualPlanOrder && b.task.manualPlanOrder) {
      return a.task.manualPlanOrder - b.task.manualPlanOrder;
    }
    return b.score - a.score;
  });

  const urgentCommitments: Task[] = [];
  const recommendedWork: Task[] = [];
  const routineTasks: Task[] = [];
  const optionalWork: Task[] = [];
  const postponedTasksForReview: Task[] = [];

  let accumulatedHours = 0;
  const capacity = preferences.dailyCapacityHours || 7.5;

  scoredTasks.forEach(({ task, score }) => {
    const effort = task.estimatedEffortHours || 1.0;

    if (task.postponedCount && task.postponedCount >= 2) {
      postponedTasksForReview.push(task);
    }

    if (task.isRecurring) {
      routineTasks.push(task);
      accumulatedHours += effort;
    } else if (score >= 60 || task.isHardDeadline || (task.dueDate && task.dueDate <= targetDateStr)) {
      urgentCommitments.push(task);
      accumulatedHours += effort;
    } else if (accumulatedHours + effort <= capacity) {
      recommendedWork.push(task);
      accumulatedHours += effort;
    } else {
      optionalWork.push(task);
    }
  });

  const allRecommended = [...urgentCommitments, ...recommendedWork, ...routineTasks];

  return {
    date: targetDateStr,
    recommendedTasks: allRecommended,
    urgentCommitments,
    recommendedWork,
    routineTasks,
    optionalWork,
    totalEstimatedHours: Number(accumulatedHours.toFixed(1)),
    capacityHours: capacity,
    capacityExceeded: accumulatedHours > capacity,
    postponedTasksForReview,
    isApproved: false,
  };
}
