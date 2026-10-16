import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ProjectModel } from '@/models/Project';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const project = await ProjectModel.findOneAndUpdate(
      { id },
      { ...body, updatedAt: new Date().toISOString() },
      { new: true }
    ).lean();

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (err: any) {
    console.error('Error updating project in MongoDB:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const result = await ProjectModel.deleteOne({ id });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (err: any) {
    console.error('Error deleting project from MongoDB:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
