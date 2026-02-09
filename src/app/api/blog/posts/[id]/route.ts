import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { z } from 'zod';

const UpdatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  content: z.any().optional(),
  excerpt: z.string().min(1).max(500).optional(),
  category_id: z
    .string()
    .min(0)
    .max(36)
    .nullable()
    .optional()
    .transform((val: string | null | undefined) => (val === '' ? null : val)),
  status: z.enum(['draft', 'review', 'published', 'archived']).optional(),
  featured_image: z
    .string()
    .min(0)
    .max(36)
    .nullable()
    .optional()
    .transform((val: string | null | undefined) => (val === '' || val === null ? null : val)),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT bp.*, 
              bc.name as category_name, bc.slug as category_slug,
              ba.name as author_name, ba.bio as author_bio, ba.avatar_id as author_avatar
       FROM blog_posts bp
       LEFT JOIN blog_categories bc ON bp.category_id = bc.id
       LEFT JOIN blog_authors ba ON bp.author_id = ba.id
       WHERE bp.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const post = result.rows[0];
    return NextResponse.json({
      success: true,
      data: {
        ...post,
        category: { id: post.category_id, name: post.category_name, slug: post.category_slug },
        author: { id: post.author_id, name: post.author_name, bio: post.author_bio, avatar: post.author_avatar },
      },
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || !['admin', 'editor', 'content_manager'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const validation = UpdatePostSchema.safeParse(body);

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
        values.push(key === 'content' ? JSON.stringify(value) : value);
      }
    });

    if (data.status === 'published') {
      updates.push(`published_at = COALESCE(published_at, NOW())`);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(`UPDATE blog_posts SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Blog post updated successfully',
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const result = await pool.query('DELETE FROM blog_posts WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete blog post' }, { status: 500 });
  }
}
