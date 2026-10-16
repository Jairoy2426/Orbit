'use client';

import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Clock,
  User,
  Sliders,
  Check,
  Database,
  ExternalLink,
} from 'lucide-react';
import { PlanningPreferences } from '@/types';
import { storage } from '@/lib/storage';

interface SettingsViewProps {
  preferences: PlanningPreferences;
  onSavePreferences: (prefs: PlanningPreferences) => void;
  onDataReset: () => void;
}

export function SettingsView({
  preferences,
  onSavePreferences,
  onDataReset,
}: SettingsViewProps) {
  const [userName, setUserName] = useState(preferences.userName);
  const [userTitle, setUserTitle] = useState(preferences.userTitle);
  const [quote, setQuote] = useState(preferences.quote);
  const [dailyCapacityHours, setDailyCapacityHours] = useState(
    preferences.dailyCapacityHours.toString()
  );
  const [defaultPriority, setDefaultPriority] = useState(preferences.defaultPriority);
  const [deadlineFlexibility, setDeadlineFlexibility] = useState(
    preferences.deadlineFlexibility
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PlanningPreferences = {
      ...preferences,
      userName: userName.trim() || 'Hercules',
      userTitle: userTitle.trim(),
      quote: quote.trim(),
      dailyCapacityHours: parseFloat(dailyCapacityHours) || 7.5,
      defaultPriority,
      deadlineFlexibility,
    };
    onSavePreferences(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExport = () => {
    const dataStr = storage.exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orbit-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (storage.importData(content)) {
        alert('Data imported successfully!');
        window.location.reload();
      } else {
        alert('Failed to parse Orbit backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefaults = () => {
    if (
      confirm(
        'Reset all tasks, projects, job applications, and notes to reference demo data?'
      )
    ) {
      storage.resetToDefaults();
      onDataReset();
      alert('Orbit reset to default demo dataset.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">System Settings</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Tune your Daily Planning Engine thresholds, profile identity, and backup data.
        </p>
      </div>

      {/* Profile & Planning Preferences */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#0d1322] border border-[#1a253c] shadow-lg space-y-5">
        <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          Profile & Planning Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Role / Subtitle</label>
            <input
              type="text"
              value={userTitle}
              onChange={(e) => setUserTitle(e.target.value)}
              className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-400 block mb-1">Daily Mindset Quote</label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-serif italic"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Daily Capacity Limit (Hours)
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="24"
              value={dailyCapacityHours}
              onChange={(e) => setDailyCapacityHours(e.target.value)}
              className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Planning Engine flags capacity warnings when scheduled tasks exceed this limit.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Deadline Strictness</label>
            <select
              value={deadlineFlexibility}
              onChange={(e) => setDeadlineFlexibility(e.target.value as any)}
              className="w-full bg-[#0a0f1c] border border-[#1e2a44] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="strict">Strict (Prioritizes hard dates over effort)</option>
              <option value="moderate">Moderate (Balanced scoring)</option>
              <option value="relaxed">Relaxed (Focus on priority first)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#151f33]">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Preferences updated successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Data Management: Backup & Restore */}
      <div className="p-6 rounded-2xl bg-[#0d1322] border border-[#1a253c] shadow-lg space-y-4">
        <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          Data Backup & Persistence Adapter
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Orbit uses an isolated StorageAdapter interface. All your data is safely persisted in your browser
          storage, and can be exported as standard JSON at any time.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#131d33] hover:bg-[#1a2744] border border-[#233354] text-xs font-semibold text-white transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export Full Backup (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#131d33] hover:bg-[#1a2744] border border-[#233354] text-xs font-semibold text-white cursor-pointer transition-all shadow-sm">
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Restore Backup (JSON)</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-all ml-auto"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Reset Demo Seed Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
