'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Pin,
  FolderKanban,
  Briefcase,
  X,
} from 'lucide-react';
import { Note, Project, JobApplication } from '@/types';

interface NotesViewProps {
  notes: Note[];
  projects: Project[];
  jobs: JobApplication[];
  onSaveNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

type NoteCategory = Note['category'] | 'All';

export function NotesView({
  notes,
  projects,
  jobs,
  onSaveNote,
  onDeleteNote,
}: NotesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory>('All');
  const [search, setSearch] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Note['category']>('General');
  const [tags, setTags] = useState('');
  const [linkedProjectId, setLinkedProjectId] = useState('');
  const [linkedJobId, setLinkedJobId] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const categories: NoteCategory[] = [
    'All',
    'Interview Prep',
    'Career',
    'Project Doc',
    'Meeting',
    'General',
  ];

  const filteredNotes = notes.filter((n) => {
    if (selectedCategory !== 'All' && n.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const openCreateModal = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setCategory('General');
    setTags('');
    setLinkedProjectId('');
    setLinkedJobId('');
    setIsPinned(false);
    setIsModalOpen(true);
  };

  const openEditModal = (n: Note) => {
    setEditingNote(n);
    setTitle(n.title);
    setContent(n.content);
    setCategory(n.category);
    setTags(n.tags.join(', '));
    setLinkedProjectId(n.linkedProjectId || '');
    setLinkedJobId(n.linkedJobId || '');
    setIsPinned(Boolean(n.isPinned));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const noteToSave: Note = {
      id: editingNote?.id || `note-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      linkedProjectId: linkedProjectId || undefined,
      linkedJobId: linkedJobId || undefined,
      isPinned,
      createdAt: editingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveNote(noteToSave);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Notes & Knowledge</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Personal technical documentation, interview preparation, and meeting logs.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-sm active:scale-95 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Note</span>
        </button>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#111111] border border-[#222222]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes & tags..."
            className="bg-[#0c0c0c] border border-[#222222] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 w-full sm:w-60"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((n) => {
          const project = projects.find((p) => p.id === n.linkedProjectId);
          const job = jobs.find((j) => j.id === n.linkedJobId);

          return (
            <div
              key={n.id}
              onClick={() => openEditModal(n)}
              className="p-5 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#383838] transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-sm relative"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#1c1c1c] text-neutral-300 border border-[#2a2a2a]">
                    {n.category}
                  </span>
                  {n.isPinned && (
                    <span className="flex items-center gap-1 text-[10px] text-white font-semibold">
                      <Pin className="w-3 h-3 fill-white" />
                      Pinned
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-neutral-200 transition-colors">
                  {n.title}
                </h3>

                <p className="text-xs text-neutral-300 mt-2 line-clamp-4 leading-relaxed font-mono whitespace-pre-wrap">
                  {n.content}
                </p>
              </div>

              {/* Note Footer */}
              <div className="space-y-2 pt-3 border-t border-[#1c1c1c]">
                {/* Linked context */}
                {(project || job) && (
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                    {project && (
                      <span className="flex items-center gap-1 text-neutral-300 truncate">
                        <FolderKanban className="w-3 h-3" />
                        {project.name}
                      </span>
                    )}
                    {job && (
                      <span className="flex items-center gap-1 text-neutral-300 truncate">
                        <Briefcase className="w-3 h-3" />
                        {job.company}
                      </span>
                    )}
                  </div>
                )}

                {/* Tags */}
                {n.tags && n.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {n.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-[#181818] text-neutral-400 border border-[#242424] font-mono"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#111111] border border-[#252525] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#222222] px-5 py-4 bg-[#0a0a0a]">
              <h3 className="text-sm font-bold text-white">
                {editingNote ? 'Edit Note' : 'Create Note'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title..."
                  className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-400 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Note['category'])}
                    className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
                  >
                    <option value="Interview Prep">Interview Prep</option>
                    <option value="Career">Career</option>
                    <option value="Project Doc">Project Doc</option>
                    <option value="Meeting">Meeting</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="pinCheck"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-black bg-[#161616] border-[#333] accent-white"
                  />
                  <label htmlFor="pinCheck" className="text-xs font-semibold text-neutral-300 cursor-pointer">
                    Pin note to top
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1">Content (Markdown)</label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type notes, code snippets, interview prep bullets..."
                  className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 font-mono focus:outline-none focus:border-neutral-400 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-400 block mb-1">Link to Project</label>
                  <select
                    value={linkedProjectId}
                    onChange={(e) => setLinkedProjectId(e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
                  >
                    <option value="">None</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-400 block mb-1">Link to Career Record</label>
                  <select
                    value={linkedJobId}
                    onChange={(e) => setLinkedJobId(e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-400"
                  >
                    <option value="">None</option>
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.company} ({j.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="interview, aws, security"
                  className="w-full bg-[#0c0c0c] border border-[#252525] rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#222222]">
                {editingNote ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Delete this note?')) {
                        onDeleteNote(editingNote.id);
                        setIsModalOpen(false);
                      }
                    }}
                    className="text-xs text-neutral-400 hover:text-white font-semibold transition-colors"
                  >
                    Delete Note
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all shadow-sm"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
