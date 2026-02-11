import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any)?.role;
    if (!['admin', 'hr_manager'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { is_active } = body;

    if (typeof is_active !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const checkResult = await pool.query('SELECT id, name, is_active FROM blog_categories WHERE id = $1', [id]);

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    const currentStatus = checkResult.rows[0].is_active;

    const result = await pool.query(
      `UPDATE blog_categories SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, is_active`,
      [is_active, id]
    );

    const category = result.rows[0];

    await pool.query(
      `INSERT INTO user_activity_log (user_id, action, resource_type, resource_id, details, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [
        (session.user as any).id,
        `category_status_change`,
        'blog_category',
        id,
        JSON.stringify({ from: currentStatus, to: is_active })
      ]
    );

    return NextResponse.json({
      success: true,
      data: { id: category.id, name: category.name, is_active: category.is_active },
      message: is_active ? 'Category activated successfully' : 'Category deactivated successfully',
    });
  } catch (error) {
    console.error('Error updating category status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update category status' }, { status: 500 });
  }
}
