'use client';

import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Briefcase,
  FolderKanban,
  FileText,
  BarChart3,
  Settings,
  Inbox,
  Compass,
  Zap,
  ChevronLeft,
  ChevronRight,
  Globe,
  Home,
  Newspaper,
  FileBadge,
  ExternalLink,
} from 'lucide-react';
import { Task } from '@/types';

export type NavTab =
  | 'dashboard'
  | 'inbox'
  | 'tasks'
  | 'calendar'
  | 'career'
  | 'projects'
  | 'notes'
  | 'planner'
  | 'analytics'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  tasks: Task[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenQuickCapture: () => void;
  onSelectProject?: (projectId: string) => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  tasks,
  collapsed,
  onToggleCollapse,
  onSelectProject,
}: SidebarProps) {
  const activeTasksCount = tasks.filter((t) => t.status !== 'done' && t.status !== 'cancelled').length;
  const inboxCount = tasks.filter((t) => t.status === 'inbox').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: inboxCount > 0 ? inboxCount : null },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: activeTasksCount },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'career', label: 'Job Applications', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'planner', label: 'Daily Planner', icon: Compass },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const favourites = [
    { name: 'Resume', icon: FileBadge, action: () => onSelectProject?.('proj-resume') },
    { name: 'LSSC Website', icon: Globe, action: () => onSelectProject?.('proj-lssc') },
    { name: 'Genesis Real Estate', icon: Home, action: () => onSelectProject?.('proj-genesis') },
    { name: 'Weazel News', icon: Newspaper, action: () => onSelectProject?.('proj-weazel') },
    { name: 'Naukri', icon: ExternalLink, action: () => window.open('https://www.naukri.com', '_blank') },
    { name: 'LinkedIn', icon: ExternalLink, action: () => window.open('https://www.linkedin.com', '_blank') },
  ];

  return (
    <aside
      className={`relative flex flex-col justify-between border-r border-[#1a253c] bg-[#090d16] transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      } shrink-0 select-none min-h-screen`}
    >
      {/* Top Header Logo */}
      <div className="p-4 flex items-center justify-between border-b border-[#151f33]">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onSelectTab('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          {!collapsed && (
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-wide text-white">Orbit</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  HQ
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Command Center</p>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131d33] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as NavTab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#11192b]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                {!collapsed && item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-[#18233a] text-slate-400 group-hover:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Favourites Section */}
        {!collapsed && (
          <div className="pt-2 border-t border-[#151f33]">
            <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Favourites
            </p>
            <div className="space-y-1">
              {favourites.map((fav) => {
                const Icon = fav.icon;
                return (
                  <button
                    key={fav.name}
                    onClick={fav.action}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-[#11192b] transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{fav.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-[#151f33] bg-[#070b13]">
        <div
          onClick={() => onSelectTab('settings')}
          className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-[#11192b] transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs border border-white/10 shrink-0">
            H
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">Hercules</p>
              <p className="text-[11px] text-slate-400 truncate">Stay consistent.</p>
            </div>
          )}
          {!collapsed && (
            <Settings className="w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors" />
          )}
        </div>
      </div>
    </aside>
  );
}
