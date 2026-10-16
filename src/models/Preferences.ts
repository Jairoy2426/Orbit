import mongoose, { Schema, Document, Model } from 'mongoose';
import { PlanningPreferences } from '@/types';

export interface IPreferencesDocument extends PlanningPreferences, Document {
  key: string;
}

const PreferencesSchema = new Schema<IPreferencesDocument>(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    userName: { type: String, default: 'Hercules' },
    userTitle: { type: String, default: 'Full-Stack Developer & Analyst' },
    workingDays: { type: [Number], default: [1, 2, 3, 4, 5] },
    dailyCapacityHours: { type: Number, default: 7.5 },
    defaultPriority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    deadlineFlexibility: {
      type: String,
      enum: ['strict', 'moderate', 'relaxed'],
      default: 'moderate',
    },
    targetCareerBalancePercent: { type: Number, default: 40 },
    autoReassessUnfinished: { type: Boolean, default: true },
    quote: {
      type: String,
      default: 'Discipline today builds the freedom tomorrow.',
    },
  },
  { timestamps: false, versionKey: false }
);

export const PreferencesModel: Model<IPreferencesDocument> =
  mongoose.models.Preferences ||
  mongoose.model<IPreferencesDocument>('Preferences', PreferencesSchema);
