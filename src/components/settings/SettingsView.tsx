'use client';

import React, { useState } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  User,
  Check,
  Database,
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
  const [defaultPriority] = useState(preferences.defaultPriority);
  const [deadlineFlexibility, setDeadlineFlexibility] = useState(
    preferences.deadlineFlexibility
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PlanningPreferences = {
      ...preferences,
      userName: userName.trim() || 'Jai',
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
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const ok = await storage.importData(content);
      if (ok) {
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
        <p className="text-xs text-neutral-400 mt-0.5">
          Tune your Daily Planning Engine thresholds, profile identity, and backup data.
        </p>
      </div>

      {/* Profile & Planning Preferences */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#111111] border border-[#222222] shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <User className="w-4 h-4 text-white" />
          Profile & Planning Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">Role / Subtitle</label>
            <input
              type="text"
              value={userTitle}
              onChange={(e) => setUserTitle(e.target.value)}
              className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-neutral-400 block mb-1">Daily Mindset Quote</label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 italic"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">
              Daily Capacity Limit (Hours)
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="24"
              value={dailyCapacityHours}
              onChange={(e) => setDailyCapacityHours(e.target.value)}
              className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              Planning Engine flags capacity warnings when scheduled tasks exceed this limit.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">Deadline Strictness</label>
            <select
              value={deadlineFlexibility}
              onChange={(e) => setDeadlineFlexibility(e.target.value as any)}
              className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
            >
              <option value="strict">Strict (Prioritizes hard dates over effort)</option>
              <option value="moderate">Moderate (Balanced scoring)</option>
              <option value="relaxed">Relaxed (Focus on priority first)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#1c1c1c]">
          {savedSuccess && (
            <span className="text-xs font-semibold text-white flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Preferences updated successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all shadow-sm"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Data Management: Backup & Persistence Adapter */}
      <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <Database className="w-4 h-4 text-white" />
            Database & Persistence: MongoDB Atlas
          </h3>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1c1c1c] text-white border border-[#2e2e2e] text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Atlas Connected
          </span>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed bg-[#0c0c0c] p-3 rounded-xl border border-[#222222] font-mono text-[11px]">
          Cluster: <span className="text-white font-bold">orbit.gswkaub.mongodb.net</span> • Database: <span className="text-white font-bold">orbit</span>
          <br />
          All tasks, projects, job applications, notes, and planning preferences automatically persist to your MongoDB Atlas cluster.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={async () => {
              await storage.syncFromMongo();
              onDataReset();
              alert('Successfully synchronized state with MongoDB Atlas!');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-black" />
            <span>Sync with Atlas Now</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-neutral-800 border border-[#2b2b2b] text-xs font-semibold text-white transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-neutral-300" />
            <span>Export Backup (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-neutral-800 border border-[#2b2b2b] text-xs font-semibold text-white cursor-pointer transition-all shadow-sm">
            <Upload className="w-4 h-4 text-neutral-300" />
            <span>Restore Backup (JSON)</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <button
            type="button"
            onClick={handleResetToDefaults}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161616] hover:bg-neutral-800 border border-[#262626] text-xs font-semibold text-neutral-400 hover:text-white transition-all ml-auto"
          >
            <RotateCcw className="w-4 h-4 text-neutral-400" />
            <span>Reset Demo Seed Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
