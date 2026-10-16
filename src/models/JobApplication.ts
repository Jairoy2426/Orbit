import mongoose, { Schema, Document, Model } from 'mongoose';
import { JobApplication as JobType } from '@/types';

export interface IJobDocument extends Omit<JobType, 'id'>, Document {
  id: string;
}

const JobApplicationSchema = new Schema<IJobDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    jobUrl: { type: String },
    source: {
      type: String,
      enum: ['LinkedIn', 'Naukri', 'Company Career Page', 'Referral', 'Other'],
      default: 'LinkedIn',
    },
    location: { type: String, default: 'Remote' },
    workArrangement: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'Remote',
    },
    salaryNotes: { type: String },
    applicationDate: { type: String, required: true },
    status: {
      type: String,
      enum: [
        'interested',
        'to_apply',
        'applied',
        'follow_up_due',
        'interview',
        'offer',
        'rejected',
        'withdrawn',
      ],
      default: 'applied',
    },
    resumeVersion: { type: String },
    recruiterName: { type: String },
    recruiterEmail: { type: String },
    recruiterPhone: { type: String },
    lastContactDate: { type: String },
    nextFollowUpDate: { type: String },
    interviewDate: { type: String },
    interviewStage: { type: String },
    notes: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: false, versionKey: false }
);

export const JobModel: Model<IJobDocument> =
  mongoose.models.JobApplication ||
  mongoose.model<IJobDocument>('JobApplication', JobApplicationSchema);
