import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { PreferencesModel } from '@/models/Preferences';
import { INITIAL_PREFERENCES } from '@/lib/seed-data';

export async function GET() {
  try {
    await connectToDatabase();
    let prefs = await PreferencesModel.findOne({ key: 'global' }).lean();
    if (!prefs) {
      prefs = await PreferencesModel.create({
        ...INITIAL_PREFERENCES,
        key: 'global',
      });
    }
    return NextResponse.json({ success: true, preferences: prefs });
  } catch (err: any) {
    console.error('Error fetching preferences from MongoDB:', err);
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

    const prefs = await PreferencesModel.findOneAndUpdate(
      { key: 'global' },
      { ...body, key: 'global' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ success: true, preferences: prefs });
  } catch (err: any) {
    console.error('Error saving preferences to MongoDB:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
