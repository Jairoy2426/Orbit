import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { JobModel } from '@/models/JobApplication';

export async function GET() {
  try {
    await connectToDatabase();
    const jobs = await JobModel.find({}).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ success: true, jobs });
  } catch (err: any) {
    console.error('Error fetching job applications from MongoDB:', err);
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

    if (!body.company || !body.role) {
      return NextResponse.json(
        { success: false, error: 'Company and role are required' },
        { status: 400 }
      );
    }

    const jobId = body.id || `job-${Date.now()}`;
    const jobData = {
      ...body,
      id: jobId,
      updatedAt: new Date().toISOString(),
    };

    const job = await JobModel.findOneAndUpdate(
      { id: jobId },
      jobData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ success: true, job });
  } catch (err: any) {
    console.error('Error saving job application to MongoDB:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
