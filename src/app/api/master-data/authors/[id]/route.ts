import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { z } from 'zod';

const UpdateAuthorSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(1000).optional().nullable(),
  role: z.string().max(100).optional().nullable(),
  avatar_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await pool.query('SELECT * FROM blog_authors WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Author not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch author' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any)?.role;
    if (!['admin', 'hr_manager'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const validation = UpdateAuthorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const data = validation.data;
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }

    if (data.bio !== undefined) {
      updates.push(`bio = $${paramIndex++}`);
      values.push(data.bio);
    }

    if (data.role !== undefined) {
      updates.push(`role = $${paramIndex++}`);
      values.push(data.role);
    }

    if (data.avatar_id !== undefined) {
      updates.push(`avatar_id = $${paramIndex++}`);
      values.push(data.avatar_id);
    }

    if (data.is_active !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(data.is_active);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: true, message: 'No changes to update' });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(`UPDATE blog_authors SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Author not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0], message: 'Author updated successfully' });
  } catch (error) {
    console.error('Error updating author:', error);
    return NextResponse.json({ success: false, error: 'Failed to update author' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const result = await pool.query('DELETE FROM blog_authors WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Author not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Author deleted successfully' });
  } catch (error) {
    console.error('Error deleting author:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete author' }, { status: 500 });
  }
}
