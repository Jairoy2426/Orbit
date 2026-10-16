import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TaskModel } from '@/models/Task';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const task = await TaskModel.findOneAndUpdate(
      { id },
      { ...body, updatedAt: new Date().toISOString() },
      { new: true }
    ).lean();

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, task });
  } catch (err: any) {
    console.error('Error updating task in MongoDB:', err);
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

    const result = await TaskModel.deleteOne({ id });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (err: any) {
    console.error('Error deleting task from MongoDB:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
