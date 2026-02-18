import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const result = await pool.query(
      `SELECT j.*, 
              d.name as department_name,
              l.name as location_name, l.is_remote as location_remote
       FROM jobs j
       LEFT JOIN departments d ON j.department_id = d.id
       LEFT JOIN locations l ON j.location_id = l.id
       WHERE j.slug = $1 AND j.status = 'open'`,
      [slug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    const job = result.rows[0];
    return NextResponse.json({
      success: true,
      data: {
        id: job.id,
        title: job.title,
        slug: job.slug,
        description: job.description,
        responsibilities: job.responsibilities,
        requirements: job.requirements,
        benefits: job.benefits,
        employment_type: job.employment_type,
        level: job.level,
        apply_url: job.apply_url,
        status: job.status,
        created_at: job.created_at,
        updated_at: job.updated_at,
        published_at: job.published_at,
        department: { 
          id: job.department_id, 
          name: job.department_name 
        },
        location: { 
          id: job.location_id, 
          name: job.location_name,
          is_remote: job.location_remote
        },
      },
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch job' }, { status: 500 });
  }
}
