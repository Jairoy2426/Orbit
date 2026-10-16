import mongoose, { Schema, Document, Model } from 'mongoose';
import { Project as ProjectType } from '@/types';

export interface IProjectDocument extends Omit<ProjectType, 'id'>, Document {
  id: string;
}

const MilestoneSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    dueDate: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProjectDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['planning', 'in_progress', 'on_hold', 'completed', 'archived'],
      default: 'in_progress',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    startDate: { type: String },
    deadline: { type: String },
    color: { type: String, default: '#3b82f6' },
    milestones: { type: [MilestoneSchema], default: [] },
    notes: { type: String },
    repoUrl: { type: String },
    liveUrl: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: false, versionKey: false }
);

export const ProjectModel: Model<IProjectDocument> =
  mongoose.models.Project || mongoose.model<IProjectDocument>('Project', ProjectSchema);
