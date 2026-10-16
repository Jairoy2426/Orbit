import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { NoteModel } from '@/models/Note';

export async function GET() {
  try {
    await connectToDatabase();
    const notes = await NoteModel.find({}).sort({ isPinned: -1, updatedAt: -1 }).lean();
    return NextResponse.json({ success: true, notes });
  } catch (err: any) {
    console.error('Error fetching notes from MongoDB:', err);
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
        { success: false, error: 'Note title is required' },
        { status: 400 }
      );
    }

    const noteId = body.id || `note-${Date.now()}`;
    const noteData = {
      ...body,
      id: noteId,
      updatedAt: new Date().toISOString(),
    };

    const note = await NoteModel.findOneAndUpdate(
      { id: noteId },
      noteData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ success: true, note });
  } catch (err: any) {
    console.error('Error saving note to MongoDB:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
