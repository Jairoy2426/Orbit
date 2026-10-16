import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TaskModel } from '@/models/Task';

export async function GET() {
  try {
    await connectToDatabase();
    const tasks = await TaskModel.find({}).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ success: true, tasks });
  } catch (err: any) {
    console.error('Error fetching tasks from MongoDB:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Task title is required' },
        { status: 400 }
      );
    }

    const taskId = body.id || `task-${Date.now()}`;
    const taskData = {
      ...body,
      id: taskId,
      updatedAt: new Date().toISOString(),
    };

    const task = await TaskModel.findOneAndUpdate(
      { id: taskId },
      taskData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ success: true, task });
  } catch (err: any) {
    console.error('Error saving task to MongoDB:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
