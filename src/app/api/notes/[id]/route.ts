import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { NoteModel } from '@/models/Note';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const note = await NoteModel.findOneAndUpdate(
      { id },
      { ...body, updatedAt: new Date().toISOString() },
      { new: true }
    ).lean();

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, note });
  } catch (err: any) {
    console.error('Error updating note in MongoDB:', err);
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

    const result = await NoteModel.deleteOne({ id });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (err: any) {
    console.error('Error deleting note from MongoDB:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
