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

    // Validate status
    const validStatuses = ['draft', 'review', 'published', 'archived'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Check user permissions based on status transition
    // Only admin and content_manager can publish/archive
    if ((status === 'published' || status === 'archived') && 
        !['admin', 'content_manager'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to perform this action' },
        { status: 403 }
      );
    }

    // Check if post exists
    const checkResult = await pool.query(
      'SELECT id, status FROM blog_posts WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    const currentStatus = checkResult.rows[0].status;

    // Validate status transitions
    // draft -> review (any editor+)
    // review -> published (admin/content_manager only)
    // published -> archived (admin/content_manager only)
    // draft -> archived (admin/content_manager only)

    if (currentStatus === 'draft' && status === 'review') {
      // Any editor+ can submit for review
      if (!['admin', 'editor', 'content_manager'].includes(userRole)) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to perform this action' },
          { status: 403 }
        );
      }
    }

    // Build update query
    let updateFields = 'status = $1, updated_at = NOW()';
    const updateParams: any[] = [status];
    let paramIndex = 2;

    // Set published_at if publishing
    if (status === 'published' && currentStatus !== 'published') {
      updateFields += `, published_at = NOW()`;
    }

    updateFields += ` WHERE id = $${paramIndex}`;
    updateParams.push(id);
    paramIndex++;

    const query = `
      UPDATE blog_posts 
      SET ${updateFields}
      RETURNING id, title, status, published_at, created_at, updated_at
    `;

    const result = await pool.query(query, updateParams);
    const post = result.rows[0];

    // Log activity
    await pool.query(
      `INSERT INTO user_activity_log (user_id, action, resource_type, resource_id, details, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [
        (session.user as any).id,
        `post_status_change`,
        'blog_post',
        id,
        JSON.stringify({ from: currentStatus, to: status })
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        id: post.id,
        title: post.title,
        status: post.status,
        published_at: post.published_at,
        updated_at: post.updated_at,
      },
    });
  } catch (error) {
    console.error('Error updating post status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post status' },
      { status: 500 }
    );
  }
}
