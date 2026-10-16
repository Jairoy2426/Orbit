import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ProjectModel } from '@/models/Project';

export async function GET() {
  try {
    await connectToDatabase();
    const projects = await ProjectModel.find({}).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ success: true, projects });
  } catch (err: any) {
    console.error('Error fetching projects from MongoDB:', err);
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

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Project name is required' },
        { status: 400 }
      );
    }

    const projectId = body.id || `proj-${Date.now()}`;
    const projectData = {
      ...body,
      id: projectId,
      updatedAt: new Date().toISOString(),
    };

    const project = await ProjectModel.findOneAndUpdate(
      { id: projectId },
      projectData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ success: true, project });
  } catch (err: any) {
    console.error('Error saving project to MongoDB:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
