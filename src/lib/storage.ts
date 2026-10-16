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

  // --- Initialization & MongoDB Sync ---
  public async init() {
    if (!this.isBrowser()) return;

    // First load from local cache for instant zero-latency paint
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit) {
      this.resetLocalToDefaults();
    }

    // Now sync with MongoDB Atlas in background
    try {
      await this.syncFromMongo();
    } catch (err) {
      console.warn('Could not sync with MongoDB on boot, using local cache:', err);
    }
  }

  public async syncFromMongo() {
    if (!this.isBrowser()) return;
    try {
      const [tasksRes, projectsRes, jobsRes, notesRes, prefsRes] = await Promise.all([
        fetch('/api/tasks').then((r) => r.json()),
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/jobs').then((r) => r.json()),
        fetch('/api/notes').then((r) => r.json()),
        fetch('/api/preferences').then((r) => r.json()),
      ]);

      // If database is completely empty on first run, seed MongoDB
      if (tasksRes.success && (!tasksRes.tasks || tasksRes.tasks.length === 0)) {
        console.log('MongoDB is empty. Seeding initial Orbit data into MongoDB Atlas...');
        const seedRes = await fetch('/api/seed', { method: 'POST' }).then((r) => r.json());
        if (seedRes.success) {
          await this.syncFromMongo();
          return;
        }
      }

      let updated = false;

      if (tasksRes.success && Array.isArray(tasksRes.tasks)) {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasksRes.tasks));
        updated = true;
      }
      if (projectsRes.success && Array.isArray(projectsRes.projects)) {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projectsRes.projects));
        updated = true;
      }
      if (jobsRes.success && Array.isArray(jobsRes.jobs)) {
        localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobsRes.jobs));
        updated = true;
      }
      if (notesRes.success && Array.isArray(notesRes.notes)) {
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notesRes.notes));
        updated = true;
      }
      if (prefsRes.success && prefsRes.preferences) {
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefsRes.preferences));
        updated = true;
      }

      if (updated) {
        localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
        notify();
      }
    } catch (err) {
      console.error('Failed to sync from MongoDB Atlas:', err);
    }
  }

  private resetLocalToDefaults() {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOB_APPLICATIONS));
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(INITIAL_PREFERENCES));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    notify();
  }

  public async resetToDefaults() {
    if (!this.isBrowser()) return;
    this.resetLocalToDefaults();

    // Call seed API with force=true to wipe & reseed MongoDB Atlas
    try {
      await fetch('/api/seed?force=true', { method: 'POST' });
      await this.syncFromMongo();
    } catch (err) {
      console.error('Failed to reset MongoDB Atlas:', err);
    }
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

  public async importData(jsonString: string): Promise<boolean> {
    if (!this.isBrowser()) return false;
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.tasks)) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks));
      if (Array.isArray(data.projects)) localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
      if (Array.isArray(data.jobs)) localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(data.jobs));
      if (Array.isArray(data.notes)) localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data.notes));
      if (data.preferences) localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(data.preferences));
      notify();

      // Sync imported records to MongoDB
      if (Array.isArray(data.tasks)) {
        for (const t of data.tasks) {
          fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(t) }).catch(() => {});
        }
      }
      if (Array.isArray(data.projects)) {
        for (const p of data.projects) {
          fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) }).catch(() => {});
        }
      }
      if (Array.isArray(data.jobs)) {
        for (const j of data.jobs) {
          fetch('/api/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(j) }).catch(() => {});
        }
      }
      if (Array.isArray(data.notes)) {
        for (const n of data.notes) {
          fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(n) }).catch(() => {});
        }
      }
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
    let savedTask: Task;

    if (existingIndex >= 0) {
      savedTask = { ...task, updatedAt: new Date().toISOString() };
      updatedTasks = [...tasks];
      updatedTasks[existingIndex] = savedTask;
    } else {
      savedTask = {
        ...task,
        id: task.id || `task-${Date.now()}`,
        createdAt: task.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedTasks = [savedTask, ...tasks];
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
    }
    notify();

    // Async sync to MongoDB
    if (this.isBrowser()) {
      fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedTask),
      }).catch((err) => console.error('MongoDB sync failed for saveTask:', err));
    }

    return savedTask;
  }

  public deleteTask(id: string) {
    const tasks = this.getTasks().filter((t) => t.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    }
    notify();

    // Async sync to MongoDB
    if (this.isBrowser()) {
      fetch(`/api/tasks/${id}`, { method: 'DELETE' }).catch((err) =>
        console.error('MongoDB sync failed for deleteTask:', err)
      );
    }
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
    let savedProject: Project;

    if (existingIndex >= 0) {
      savedProject = { ...project, updatedAt: new Date().toISOString() };
      updatedProjects = [...projects];
      updatedProjects[existingIndex] = savedProject;
    } else {
      savedProject = {
        ...project,
        id: project.id || `proj-${Date.now()}`,
        createdAt: project.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedProjects = [savedProject, ...projects];
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
    }
    notify();

    // Async sync to MongoDB
    if (this.isBrowser()) {
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedProject),
      }).catch((err) => console.error('MongoDB sync failed for saveProject:', err));
    }

    return savedProject;
  }

  public deleteProject(id: string) {
    const projects = this.getProjects().filter((p) => p.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    }
    notify();

    // Async sync to MongoDB
    if (this.isBrowser()) {
      fetch(`/api/projects/${id}`, { method: 'DELETE' }).catch((err) =>
        console.error('MongoDB sync failed for deleteProject:', err)
      );
    }
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
    let savedJob: JobApplication;

    if (existingIndex >= 0) {
      savedJob = { ...job, updatedAt: new Date().toISOString() };
      updatedJobs = [...jobs];
      updatedJobs[existingIndex] = savedJob;
    } else {
      savedJob = {
        ...job,
        id: job.id || `job-${Date.now()}`,
        createdAt: job.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedJobs = [savedJob, ...jobs];
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updatedJobs));
    }
    notify();

    // Async sync to MongoDB
    if (this.isBrowser()) {
      fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedJob),
      }).catch((err) => console.error('MongoDB sync failed for saveJobApplication:', err));
    }

    return savedJob;
  }

  public deleteJobApplication(id: string) {
    const jobs = this.getJobApplications().filter((j) => j.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    }
    notify();

    // Async sync to MongoDB
    if (this.isBrowser()) {
      fetch(`/api/jobs/${id}`, { method: 'DELETE' }).catch((err) =>
        console.error('MongoDB sync failed for deleteJobApplication:', err)
      );
    }
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
    let savedNote: Note;

    if (existingIndex >= 0) {
      savedNote = { ...note, updatedAt: new Date().toISOString() };
      updatedNotes = [...notes];
      updatedNotes[existingIndex] = savedNote;
    } else {
      savedNote = {
        ...note,
        id: note.id || `note-${Date.now()}`,
        createdAt: note.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedNotes = [savedNote, ...notes];
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
    }
    notify();

    // Async sync to MongoDB
    if (this.isBrowser()) {
      fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedNote),
      }).catch((err) => console.error('MongoDB sync failed for saveNote:', err));
    }

    return savedNote;
  }

  public deleteNote(id: string) {
    const notes = this.getNotes().filter((n) => n.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    }
    notify();

    // Async sync to MongoDB
    if (this.isBrowser()) {
      fetch(`/api/notes/${id}`, { method: 'DELETE' }).catch((err) =>
        console.error('MongoDB sync failed for deleteNote:', err)
      );
    }
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

    // Async sync to MongoDB
    if (this.isBrowser()) {
      fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      }).catch((err) => console.error('MongoDB sync failed for savePreferences:', err));
    }
  }
}

export const storage = new OrbitStorage();
