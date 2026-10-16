import mongoose, { Schema, Document, Model } from 'mongoose';
import { Task as TaskType } from '@/types';

export interface ITaskDocument extends Omit<TaskType, 'id'>, Document {
  id: string;
}

const TaskSchema = new Schema<ITaskDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['inbox', 'todo', 'in_progress', 'blocked', 'done', 'cancelled'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    dueDate: { type: String },
    dueTime: { type: String },
    reminderTime: { type: String },
    estimatedEffortHours: { type: Number, default: 1 },
    projectId: { type: String },
    careerApplicationId: { type: String },
    tags: { type: [String], default: [] },
    dependencies: { type: [String], default: [] },
    isHardDeadline: { type: Boolean, default: false },
    consequencesOfDelay: { type: String },
    isRecurring: { type: Boolean, default: false },
    recurrenceRule: {
      type: String,
      enum: ['daily', 'weekdays', 'weekly', 'biweekly', 'monthly'],
    },
    postponedCount: { type: Number, default: 0 },
    completedAt: { type: String },
    recommendationReason: { type: String },
    isRecommendedToday: { type: Boolean, default: false },
    manualPlanOrder: { type: Number },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: false, versionKey: false }
);

// Prevent model overwrite in development hot reloading
export const TaskModel: Model<ITaskDocument> =
  mongoose.models.Task || mongoose.model<ITaskDocument>('Task', TaskSchema);
