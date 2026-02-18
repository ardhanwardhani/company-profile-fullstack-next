import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import pool from '@/lib/db';
import { checkPermission } from '@/lib/permissions';

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
      'SELECT id, title FROM jobs WHERE id = $1',
      [jobId]
    );

    if (jobExists.rows.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const body = await request.json();
    const { applicant_name, applicant_email, applicant_phone, cover_letter, resume_url } = body;

    if (!applicant_name || !applicant_email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO job_applications (job_id, applicant_name, applicant_email, applicant_phone, cover_letter, resume_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [jobId, applicant_name, applicant_email, applicant_phone, cover_letter, resume_url]
    );

    return NextResponse.json({
      success: true,
      application_id: result.rows[0].id,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Job application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasAccess = await checkPermission((session.user as any).id, 'jobs.view_applications');
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const jobId = id;

    if (!jobId) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT id, applicant_name, applicant_email, applicant_phone, cover_letter, resume_url, status, applied_at
       FROM job_applications
       WHERE job_id = $1
       ORDER BY applied_at DESC`,
      [jobId]
    );

    return NextResponse.json({ applications: result.rows });
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
