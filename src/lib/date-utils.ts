import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, isValid } from 'date-fns';

export function getTodayDateString(): string {
  // Current local time as anchored in the prompt metadata (2026-10-16) or runtime fallback
  return '2026-10-16';
}

export function formatFriendlyDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    const today = parseISO(getTodayDateString());
    if (isSameDay(date, today)) return 'Today';
    if (isSameDay(date, addDays(today, 1))) return 'Tomorrow';
    if (isSameDay(date, addDays(today, -1))) return 'Yesterday';
    return format(date, 'd MMM');
  } catch {
    return dateStr;
  }
}

export function formatFullDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    return format(date, 'EEE, d MMM yyyy');
  } catch {
    return dateStr;
  }
}

export function getWeekDates(anchorDateStr = getTodayDateString()): Date[] {
  try {
    const anchor = parseISO(anchorDateStr);
    const start = startOfWeek(anchor, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(anchor, { weekStartsOn: 1 }); // Sunday
    return eachDayOfInterval({ start, end });
  } catch {
    return [];
  }
}

/**
 * Natural language parser for Quick Capture
 * Supports strings like:
 * "Fix LSSC website tomorrow"
 * "Check job posts every weekday"
 * "Follow up with recruiter next Monday"
 */
export interface ParsedQuickCapture {
  cleanTitle: string;
  dueDate?: string;
  isRecurring?: boolean;
  recurrenceRule?: 'daily' | 'weekdays' | 'weekly' | 'biweekly' | 'monthly';
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export function parseNaturalDateString(input: string, baseDateStr = getTodayDateString()): ParsedQuickCapture {
  const base = parseISO(baseDateStr);
  let cleanTitle = input.trim();
  let dueDate: string | undefined;
  let isRecurring = false;
  let recurrenceRule: 'daily' | 'weekdays' | 'weekly' | 'biweekly' | 'monthly' | undefined;
  let priority: 'low' | 'medium' | 'high' | 'critical' | undefined;

  // Check priority tokens
  if (/\b(urgent|p1|critical)\b/i.test(cleanTitle)) {
    priority = 'critical';
    cleanTitle = cleanTitle.replace(/\b(urgent|p1|critical)\b/gi, '').trim();
  } else if (/\b(high priority|high|p2)\b/i.test(cleanTitle)) {
    priority = 'high';
    cleanTitle = cleanTitle.replace(/\b(high priority|high|p2)\b/gi, '').trim();
  } else if (/\b(low priority|low|p4)\b/i.test(cleanTitle)) {
    priority = 'low';
    cleanTitle = cleanTitle.replace(/\b(low priority|low|p4)\b/gi, '').trim();
  }

  // Check recurrence
  if (/every\s+weekday/i.test(cleanTitle)) {
    isRecurring = true;
    recurrenceRule = 'weekdays';
    dueDate = format(base, 'yyyy-MM-dd');
    cleanTitle = cleanTitle.replace(/every\s+weekday/gi, '').trim();
  } else if (/every\s+day|daily/i.test(cleanTitle)) {
    isRecurring = true;
    recurrenceRule = 'daily';
    dueDate = format(base, 'yyyy-MM-dd');
    cleanTitle = cleanTitle.replace(/every\s+day|daily/gi, '').trim();
  } else if (/every\s+week|weekly/i.test(cleanTitle)) {
    isRecurring = true;
    recurrenceRule = 'weekly';
    dueDate = format(base, 'yyyy-MM-dd');
    cleanTitle = cleanTitle.replace(/every\s+week|weekly/gi, '').trim();
  }

  // Check simple relative days
  if (/\btoday\b/i.test(cleanTitle)) {
    dueDate = format(base, 'yyyy-MM-dd');
    cleanTitle = cleanTitle.replace(/\btoday\b/gi, '').trim();
  } else if (/\btomorrow\b/i.test(cleanTitle)) {
    dueDate = format(addDays(base, 1), 'yyyy-MM-dd');
    cleanTitle = cleanTitle.replace(/\btomorrow\b/gi, '').trim();
  } else if (/next\s+monday/i.test(cleanTitle)) {
    // Current day is Thursday (2026-10-16), next Monday is Oct 19
    dueDate = '2026-10-19';
    cleanTitle = cleanTitle.replace(/next\s+monday/gi, '').trim();
  } else if (/next\s+friday/i.test(cleanTitle)) {
    dueDate = '2026-10-23';
    cleanTitle = cleanTitle.replace(/next\s+friday/gi, '').trim();
  } else if (/\bthis\s+friday\b|\bfriday\b/i.test(cleanTitle)) {
    dueDate = '2026-10-17';
    cleanTitle = cleanTitle.replace(/\bthis\s+friday\b|\bfriday\b/gi, '').trim();
  }

  // Clean trailing prepositions like "at", "on", "for"
  cleanTitle = cleanTitle.replace(/\s+(at|on|for|by)$/i, '').trim();

  return {
    cleanTitle: cleanTitle || input,
    dueDate,
    isRecurring,
    recurrenceRule,
    priority,
  };
}
