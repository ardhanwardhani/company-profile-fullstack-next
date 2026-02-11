import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { z } from 'zod';

const UpdateJobSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.any().optional(),
  responsibilities: z.any().optional(),
  requirements: z.any().optional(),
  benefits: z.any().optional(),
  department_id: z.string().uuid().optional(),
  location_id: z.string().uuid().optional(),
  employment_type: z.enum(['full-time', 'contract', 'intern']).optional(),
  level: z.enum(['junior', 'mid', 'senior']).optional(),
  apply_url: z.string().url().or(z.string().startsWith('mailto:')).optional(),
  status: z.enum(['draft', 'open', 'closed', 'archived']).optional(),
  seo_title: z.string().max(255).optional().nullable(),
  seo_description: z.string().max(500).optional().nullable(),
  seo_index: z.boolean().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const result = await pool.query(
      `SELECT j.*, d.name as department_name, l.name as location_name, l.is_remote
       FROM jobs j
       LEFT JOIN departments d ON j.department_id = d.id
       LEFT JOIN locations l ON j.location_id = l.id
       WHERE j.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    const job = result.rows[0];
    return NextResponse.json({
      success: true,
      data: {
        ...job,
        department: { id: job.department_id, name: job.department_name },
        location: { id: job.location_id, name: job.location_name, is_remote: job.is_remote },
      },
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch job' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || !['admin', 'hr_manager'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const validation = UpdateJobSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const data = validation.data;
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = $${paramIndex++}`);
        if (['description', 'responsibilities', 'requirements', 'benefits'].includes(key)) {
          values.push(JSON.stringify(value));
        } else if (value === null) {
          values.push(null);
        } else {
          values.push(value);
        }
      }
    });

    if (data.status === 'open') {
      updates.push(`published_at = COALESCE(published_at, NOW())`);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(`UPDATE jobs SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Job updated successfully',
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ success: false, error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete job' }, { status: 500 });
  }
}
