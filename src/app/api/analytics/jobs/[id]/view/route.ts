import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = id;

    if (!jobId) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
    }

    const jobExists = await pool.query(
      'SELECT id FROM jobs WHERE id = $1',
      [jobId]
    );

    if (jobExists.rows.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    await pool.query(
      'INSERT INTO job_listing_views (job_id) VALUES ($1)',
      [jobId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Job view tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
