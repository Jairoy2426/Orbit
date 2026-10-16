import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TaskModel } from '@/models/Task';
import { ProjectModel } from '@/models/Project';
import { JobModel } from '@/models/JobApplication';
import { NoteModel } from '@/models/Note';
import { PreferencesModel } from '@/models/Preferences';
import {
  INITIAL_TASKS,
  INITIAL_PROJECTS,
  INITIAL_JOB_APPLICATIONS,
  INITIAL_NOTES,
  INITIAL_PREFERENCES,
} from '@/lib/seed-data';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const force = url.searchParams.get('force') === 'true';

    const taskCount = await TaskModel.countDocuments();

    if (taskCount > 0 && !force) {
      return NextResponse.json({
        message: 'Database already has records. Use ?force=true to re-seed.',
        taskCount,
      });
    }

    if (force) {
      await TaskModel.deleteMany({});
      await ProjectModel.deleteMany({});
      await JobModel.deleteMany({});
      await NoteModel.deleteMany({});
      await PreferencesModel.deleteMany({});
    }

    // Insert seeds
    await TaskModel.insertMany(INITIAL_TASKS);
    await ProjectModel.insertMany(INITIAL_PROJECTS);
    await JobModel.insertMany(INITIAL_JOB_APPLICATIONS);
    await NoteModel.insertMany(INITIAL_NOTES);
    await PreferencesModel.findOneAndUpdate(
      { key: 'global' },
      { ...INITIAL_PREFERENCES, key: 'global' },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'MongoDB Atlas seeded with Orbit records!',
      counts: {
        tasks: INITIAL_TASKS.length,
        projects: INITIAL_PROJECTS.length,
        jobs: INITIAL_JOB_APPLICATIONS.length,
        notes: INITIAL_NOTES.length,
      },
    });
  } catch (err: any) {
    console.error('Error seeding MongoDB:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Seeding failed' },
      { status: 500 }
    );
  }
}
