import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userRole = (session.user as any).role;
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const validStatuses = ['draft', 'open', 'closed', 'archived'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    if (!['admin', 'hr_manager'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to perform this action' },
        { status: 403 }
      );
    }

    const checkResult = await pool.query(
      'SELECT id, status FROM jobs WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    const currentStatus = checkResult.rows[0].status;

    let updateFields = 'status = $1, updated_at = NOW()';
    const updateParams: any[] = [status];
    let paramIndex = 2;

    if (status === 'open' && currentStatus !== 'open') {
      updateFields += `, published_at = NOW()`;
    }

    updateFields += ` WHERE id = $${paramIndex}`;
    updateParams.push(id);
    paramIndex++;

    const query = `
      UPDATE jobs 
      SET ${updateFields}
      RETURNING id, title, status, published_at, created_at, updated_at
    `;

    const result = await pool.query(query, updateParams);
    const job = result.rows[0];

    await pool.query(
      `INSERT INTO user_activity_log (user_id, action, resource_type, resource_id, details, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [
        (session.user as any).id,
        `job_status_change`,
        'job',
        id,
        JSON.stringify({ from: currentStatus, to: status })
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        id: job.id,
        title: job.title,
        status: job.status,
        published_at: job.published_at,
        updated_at: job.updated_at,
      },
    });
  } catch (error) {
    console.error('Error updating job status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update job status' },
      { status: 500 }
    );
  }
}
