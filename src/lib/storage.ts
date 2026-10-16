'use client';

import { Task, Project, JobApplication, Note, PlanningPreferences } from '@/types';
import {
  INITIAL_TASKS,
  INITIAL_PROJECTS,
  INITIAL_JOB_APPLICATIONS,
  INITIAL_NOTES,
  INITIAL_PREFERENCES,
} from './seed-data';

const STORAGE_KEYS = {
  TASKS: 'orbit_tasks_v1',
  PROJECTS: 'orbit_projects_v1',
  JOBS: 'orbit_jobs_v1',
  NOTES: 'orbit_notes_v1',
  PREFERENCES: 'orbit_preferences_v1',
  INITIALIZED: 'orbit_initialized_v1',
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => {
    try {
      l();
    } catch (e) {
      console.error('Error notifying storage listener', e);
    }
  });
}

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

class OrbitStorage {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public init() {
    if (!this.isBrowser()) return;
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit) {
      this.resetToDefaults();
    }
  }

  public resetToDefaults() {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOB_APPLICATIONS));
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(INITIAL_PREFERENCES));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    notify();
  }

  public exportData(): string {
    if (!this.isBrowser()) return '{}';
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks: this.getTasks(),
      projects: this.getProjects(),
      jobs: this.getJobApplications(),
      notes: this.getNotes(),
      preferences: this.getPreferences(),
    };
    return JSON.stringify(payload, null, 2);
  }

  public importData(jsonString: string): boolean {
    if (!this.isBrowser()) return false;
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.tasks)) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks));
      if (Array.isArray(data.projects)) localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
      if (Array.isArray(data.jobs)) localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(data.jobs));
      if (Array.isArray(data.notes)) localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data.notes));
      if (data.preferences) localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(data.preferences));
      notify();
      return true;
    } catch (err) {
      console.error('Failed to parse import data', err);
      return false;
    }
  }

  // --- TASKS ---
  public getTasks(): Task[] {
    if (!this.isBrowser()) return INITIAL_TASKS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
      return raw ? JSON.parse(raw) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  }

  public saveTask(task: Task): Task {
    const tasks = this.getTasks();
    const existingIndex = tasks.findIndex((t) => t.id === task.id);
    let updatedTasks: Task[];
    if (existingIndex >= 0) {
      updatedTasks = [...tasks];
      updatedTasks[existingIndex] = { ...task, updatedAt: new Date().toISOString() };
    } else {
      updatedTasks = [
        {
          ...task,
          id: task.id || `task-${Date.now()}`,
          createdAt: task.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...tasks,
      ];
    }
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
    }
    notify();
    return updatedTasks[existingIndex >= 0 ? existingIndex : 0];
  }

  public deleteTask(id: string) {
    const tasks = this.getTasks().filter((t) => t.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    }
    notify();
  }

  public toggleTaskCompletion(id: string): Task | null {
    const tasks = this.getTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) return null;

    const isDone = task.status === 'done';
    const updated: Task = {
      ...task,
      status: isDone ? 'todo' : 'done',
      completedAt: isDone ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.saveTask(updated);
  }

  public reorderTasks(taskIds: string[]) {
    const tasks = this.getTasks();
    const taskMap = new Map(tasks.map((t) => [t.id, t]));
    const reordered: Task[] = [];
    taskIds.forEach((id, idx) => {
      const t = taskMap.get(id);
      if (t) {
        reordered.push({ ...t, manualPlanOrder: idx + 1 });
        taskMap.delete(id);
      }
    });
    taskMap.forEach((t) => reordered.push(t));
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(reordered));
    }
    notify();
  }

  // --- PROJECTS ---
  public getProjects(): Project[] {
    if (!this.isBrowser()) return INITIAL_PROJECTS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return raw ? JSON.parse(raw) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  }

  public saveProject(project: Project): Project {
    const projects = this.getProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    let updatedProjects: Project[];
    if (existingIndex >= 0) {
      updatedProjects = [...projects];
      updatedProjects[existingIndex] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      updatedProjects = [
        {
          ...project,
          id: project.id || `proj-${Date.now()}`,
          createdAt: project.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...projects,
      ];
    }
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
    }
    notify();
    return updatedProjects[existingIndex >= 0 ? existingIndex : 0];
  }

  public deleteProject(id: string) {
    const projects = this.getProjects().filter((p) => p.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    }
    notify();
  }

  // --- JOB APPLICATIONS ---
  public getJobApplications(): JobApplication[] {
    if (!this.isBrowser()) return INITIAL_JOB_APPLICATIONS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.JOBS);
      return raw ? JSON.parse(raw) : INITIAL_JOB_APPLICATIONS;
    } catch {
      return INITIAL_JOB_APPLICATIONS;
    }
  }

  public saveJobApplication(job: JobApplication): JobApplication {
    const jobs = this.getJobApplications();
    const existingIndex = jobs.findIndex((j) => j.id === job.id);
    let updatedJobs: JobApplication[];
    if (existingIndex >= 0) {
      updatedJobs = [...jobs];
      updatedJobs[existingIndex] = { ...job, updatedAt: new Date().toISOString() };
    } else {
      updatedJobs = [
        {
          ...job,
          id: job.id || `job-${Date.now()}`,
          createdAt: job.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...jobs,
      ];
    }
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updatedJobs));
    }
    notify();
    return updatedJobs[existingIndex >= 0 ? existingIndex : 0];
  }

  public deleteJobApplication(id: string) {
    const jobs = this.getJobApplications().filter((j) => j.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    }
    notify();
  }

  // --- NOTES ---
  public getNotes(): Note[] {
    if (!this.isBrowser()) return INITIAL_NOTES;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
      return raw ? JSON.parse(raw) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  }

  public saveNote(note: Note): Note {
    const notes = this.getNotes();
    const existingIndex = notes.findIndex((n) => n.id === note.id);
    let updatedNotes: Note[];
    if (existingIndex >= 0) {
      updatedNotes = [...notes];
      updatedNotes[existingIndex] = { ...note, updatedAt: new Date().toISOString() };
    } else {
      updatedNotes = [
        {
          ...note,
          id: note.id || `note-${Date.now()}`,
          createdAt: note.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...notes,
      ];
    }
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
    }
    notify();
    return updatedNotes[existingIndex >= 0 ? existingIndex : 0];
  }

  public deleteNote(id: string) {
    const notes = this.getNotes().filter((n) => n.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    }
    notify();
  }

  // --- PREFERENCES ---
  public getPreferences(): PlanningPreferences {
    if (!this.isBrowser()) return INITIAL_PREFERENCES;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return raw ? JSON.parse(raw) : INITIAL_PREFERENCES;
    } catch {
      return INITIAL_PREFERENCES;
    }
  }

  public savePreferences(prefs: PlanningPreferences) {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    }
    notify();
  }
}

export const storage = new OrbitStorage();
