import mongoose, { Schema, Document, Model } from 'mongoose';
import { Note as NoteType } from '@/types';

export interface INoteDocument extends Omit<NoteType, 'id'>, Document {
  id: string;
}

const NoteSchema = new Schema<INoteDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    tags: { type: [String], default: [] },
    category: {
      type: String,
      enum: ['Interview Prep', 'Career', 'Project Doc', 'Meeting', 'General'],
      default: 'General',
    },
    linkedProjectId: { type: String },
    linkedJobId: { type: String },
    isPinned: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: false, versionKey: false }
);

export const NoteModel: Model<INoteDocument> =
  mongoose.models.Note || mongoose.model<INoteDocument>('Note', NoteSchema);
