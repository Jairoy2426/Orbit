import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { JobModel } from '@/models/JobApplication';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const job = await JobModel.findOneAndUpdate(
      { id },
      { ...body, updatedAt: new Date().toISOString() },
      { new: true }
    ).lean();

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, job });
  } catch (err: any) {
    console.error('Error updating job application in MongoDB:', err);
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

    const result = await JobModel.deleteOne({ id });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (err: any) {
    console.error('Error deleting job application from MongoDB:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
