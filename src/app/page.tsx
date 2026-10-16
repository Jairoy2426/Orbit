'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavTab } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { HeroBanner } from '@/components/dashboard/HeroBanner';
import { StatCards } from '@/components/dashboard/StatCards';
import { TodaysPriorities } from '@/components/dashboard/TodaysPriorities';
import { QuickCaptureCard } from '@/components/dashboard/QuickCaptureCard';
import { WeeklyCalendarPreview } from '@/components/dashboard/WeeklyCalendarPreview';
import { ProjectsSummary } from '@/components/dashboard/ProjectsSummary';
import { JobApplicationsSummary } from '@/components/dashboard/JobApplicationsSummary';
import { ProgressStats } from '@/components/dashboard/ProgressStats';

// Views
import { TasksView } from '@/components/tasks/TasksView';
import { CareerView } from '@/components/career/CareerView';
import { ProjectsView } from '@/components/projects/ProjectsView';
import { CalendarView } from '@/components/calendar/CalendarView';
import { NotesView } from '@/components/notes/NotesView';
import { DailyPlanView } from '@/components/planner/DailyPlanView';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { SettingsView } from '@/components/settings/SettingsView';

// Modals
import { QuickCaptureModal } from '@/components/quick-capture/QuickCaptureModal';
import { TaskModal } from '@/components/tasks/TaskModal';

// Storage and Types
import { storage, subscribeToStore } from '@/lib/storage';
import { Task, Project, JobApplication, Note, PlanningPreferences } from '@/types';
import { getTodayDateString } from '@/lib/date-utils';

export default function OrbitApp() {
  const [mounted, setMounted] = useState(false);
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data Store States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [preferences, setPreferences] = useState<PlanningPreferences>(storage.getPreferences());

  // Search & Navigation States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Modals
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Reload state from storage
  const syncStore = useCallback(() => {
    setTasks(storage.getTasks());
    setProjects(storage.getProjects());
    setJobs(storage.getJobApplications());
    setNotes(storage.getNotes());
    setPreferences(storage.getPreferences());
  }, []);

  useEffect(() => {
    storage.init();
    syncStore();
    setMounted(true);

    const unsubscribe = subscribeToStore(() => {
      syncStore();
    });

    // Global keyboard shortcut for Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickCaptureOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [syncStore]);

  // Actions
  const handleToggleTask = (id: string) => {
    storage.toggleTaskCompletion(id);
  };

  const handleSaveTask = (task: Task) => {
    storage.saveTask(task);
  };

  const handleDeleteTask = (id: string) => {
    storage.deleteTask(id);
  };

  const handleDeferTask = (id: string) => {
    const t = tasks.find((item) => item.id === id);
    if (t) {
      storage.saveTask({
        ...t,
        dueDate: '2026-10-17',
        postponedCount: (t.postponedCount || 0) + 1,
      });
    }
  };

  const handleCreateFollowUpTask = (job: JobApplication) => {
    const existing = tasks.find((t) => t.careerApplicationId === job.id && t.status !== 'done');
    if (existing) {
      setEditingTask(existing);
      setIsTaskModalOpen(true);
      return;
    }
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: `Follow up with ${job.company}`,
      description: `Check status of application for ${job.role}. Contact: ${job.recruiterName || 'recruiter'}`,
      status: 'todo',
      priority: 'high',
      dueDate: job.nextFollowUpDate || getTodayDateString(),
      dueTime: '10:00',
      estimatedEffortHours: 0.5,
      careerApplicationId: job.id,
      tags: ['career', 'recruiter', 'follow-up'],
      isHardDeadline: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.saveTask(newTask);
    setEditingTask(newTask);
    setIsTaskModalOpen(true);
  };

  const handleSelectProjectFromFavourite = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentTab('projects');
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-500 font-mono text-sm">Loading Orbit...</div>;
  }

  const remainingTasksCount = tasks.filter((t) => t.status !== 'done' && t.status !== 'cancelled').length;

  return (
    <div className="flex h-screen overflow-hidden bg-[#080c14] text-slate-100 select-none">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setMobileSidebarOpen(false);
        }}
        tasks={tasks}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        onSelectProject={handleSelectProjectFromFavourite}
      />

      {/* Center + Right Main View Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
          onOpenSearch={() => {}}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          tasks={tasks}
          jobs={jobs}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onSelectTask={(t) => {
            setEditingTask(t);
            setIsTaskModalOpen(true);
          }}
        />

        {/* Scrollable Center Area with Optional Right Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Workspace Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 space-y-6">
            {/* Tab: Dashboard */}
            {currentTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
                {/* 1. Hero Greeting Banner */}
                <HeroBanner
                  preferences={preferences}
                  remainingTasksCount={remainingTasksCount}
                  onOpenPlanner={() => setCurrentTab('planner')}
                />

                {/* 2. Top Summary Stat Cards */}
                <StatCards
                  tasks={tasks}
                  projects={projects}
                  jobs={jobs}
                  onFilterClick={(type) => {
                    if (type === 'projects') setCurrentTab('projects');
                    else if (type === 'followups') setCurrentTab('career');
                    else setCurrentTab('tasks');
                  }}
                />

                {/* 3. Middle Section: Today's Priorities + Quick Capture + Calendar Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column (7 cols): Today's Priorities */}
                  <div className="lg:col-span-7 space-y-6">
                    <TodaysPriorities
                      tasks={tasks}
                      projects={projects}
                      jobs={jobs}
                      onToggleTask={handleToggleTask}
                      onEditTask={(t) => {
                        setEditingTask(t);
                        setIsTaskModalOpen(true);
                      }}
                      onDeferTask={handleDeferTask}
                      onViewAllTasks={() => setCurrentTab('tasks')}
                    />

                    {/* Lower Trio: Projects List */}
                    <ProjectsSummary
                      projects={projects}
                      tasks={tasks}
                      onViewAllProjects={() => setCurrentTab('projects')}
                      onNewProject={() => {
                        setSelectedProjectId(null);
                        setCurrentTab('projects');
                      }}
                      onSelectProject={(pId) => {
                        setSelectedProjectId(pId);
                        setCurrentTab('projects');
                      }}
                    />
                  </div>

                  {/* Right Column (5 cols): Quick Capture + This Week Mini Calendar + Progress */}
                  <div className="lg:col-span-5 space-y-6">
                    <QuickCaptureCard
                      onCaptureTask={(t) => storage.saveTask(t as Task)}
                      onCaptureJob={(j) => storage.saveJobApplication(j as JobApplication)}
                      onCaptureProject={(p) => storage.saveProject(p as Project)}
                      onCaptureNote={(n) => storage.saveNote(n as Note)}
                    />

                    <WeeklyCalendarPreview
                      tasks={tasks}
                      onOpenFullCalendar={() => setCurrentTab('calendar')}
                      onSelectTask={(t) => {
                        setEditingTask(t);
                        setIsTaskModalOpen(true);
                      }}
                      onSelectDate={() => setCurrentTab('calendar')}
                    />

                    <JobApplicationsSummary
                      jobs={jobs}
                      onViewAllJobs={() => setCurrentTab('career')}
                      onNewJob={() => setCurrentTab('career')}
                      onSelectJob={() => setCurrentTab('career')}
                    />

                    <ProgressStats
                      tasks={tasks}
                      jobs={jobs}
                      onViewAnalytics={() => setCurrentTab('analytics')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Inbox (Triage unorganized captures) */}
            {currentTab === 'inbox' && (
              <TasksView
                tasks={tasks.filter((t) => t.status === 'inbox')}
                projects={projects}
                jobs={jobs}
                onSaveTask={handleSaveTask}
                onDeleteTask={handleDeleteTask}
                onToggleTask={handleToggleTask}
                onOpenTaskModal={(t) => {
                  setEditingTask(t || null);
                  setIsTaskModalOpen(true);
                }}
              />
            )}

            {/* Tab: Tasks */}
            {currentTab === 'tasks' && (
              <TasksView
                tasks={tasks}
                projects={projects}
                jobs={jobs}
                onSaveTask={handleSaveTask}
                onDeleteTask={handleDeleteTask}
                onToggleTask={handleToggleTask}
                onOpenTaskModal={(t) => {
                  setEditingTask(t || null);
                  setIsTaskModalOpen(true);
                }}
              />
            )}

            {/* Tab: Calendar */}
            {currentTab === 'calendar' && (
              <CalendarView
                tasks={tasks}
                jobs={jobs}
                projects={projects}
                onOpenTaskModal={(t) => {
                  setEditingTask(t || null);
                  setIsTaskModalOpen(true);
                }}
                onSelectDateToCreateTask={(dateStr) => {
                  setEditingTask({
                    id: `task-${Date.now()}`,
                    title: '',
                    status: 'todo',
                    priority: 'medium',
                    dueDate: dateStr,
                    tags: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                  setIsTaskModalOpen(true);
                }}
              />
            )}

            {/* Tab: Career */}
            {currentTab === 'career' && (
              <CareerView
                jobs={jobs}
                tasks={tasks}
                onSaveJob={(j) => storage.saveJobApplication(j)}
                onDeleteJob={(id) => storage.deleteJobApplication(id)}
                onCreateFollowUpTask={handleCreateFollowUpTask}
              />
            )}

            {/* Tab: Projects */}
            {currentTab === 'projects' && (
              <ProjectsView
                projects={projects}
                tasks={tasks}
                onSaveProject={(p) => storage.saveProject(p)}
                onDeleteProject={(id) => storage.deleteProject(id)}
                onSaveTask={handleSaveTask}
                onToggleTask={handleToggleTask}
                initialSelectedProjectId={selectedProjectId}
              />
            )}

            {/* Tab: Notes */}
            {currentTab === 'notes' && (
              <NotesView
                notes={notes}
                projects={projects}
                jobs={jobs}
                onSaveNote={(n) => storage.saveNote(n)}
                onDeleteNote={(id) => storage.deleteNote(id)}
              />
            )}

            {/* Tab: Daily Planner */}
            {currentTab === 'planner' && (
              <DailyPlanView
                tasks={tasks}
                projects={projects}
                jobs={jobs}
                preferences={preferences}
                onSaveTask={handleSaveTask}
                onToggleTask={handleToggleTask}
                onSavePreferences={(prefs) => storage.savePreferences(prefs)}
              />
            )}

            {/* Tab: Analytics */}
            {currentTab === 'analytics' && (
              <AnalyticsView tasks={tasks} projects={projects} jobs={jobs} />
            )}

            {/* Tab: Settings */}
            {currentTab === 'settings' && (
              <SettingsView
                preferences={preferences}
                onSavePreferences={(prefs) => storage.savePreferences(prefs)}
                onDataReset={syncStore}
              />
            )}
          </main>

          {/* Right Sidebar (Shown on dashboard tab for calendar & upcoming tasks) */}
          {currentTab === 'dashboard' && (
            <RightSidebar
              tasks={tasks}
              jobs={jobs}
              onOpenCalendar={() => setCurrentTab('calendar')}
              onSelectDate={() => setCurrentTab('calendar')}
            />
          )}
        </div>
      </div>

      {/* Global Quick Capture Modal (Ctrl+K or Header trigger) */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        projects={projects}
        jobs={jobs}
        onSaveTask={(t) => storage.saveTask(t as Task)}
        onSaveJob={(j) => storage.saveJobApplication(j as JobApplication)}
        onSaveProject={(p) => storage.saveProject(p as Project)}
        onSaveNote={(n) => storage.saveNote(n as Note)}
      />

      {/* Detailed Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        projects={projects}
        jobs={jobs}
        onSaveTask={handleSaveTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}
