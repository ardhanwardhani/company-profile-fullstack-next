import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = id;

    if (!postId) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const postExists = await pool.query(
      'SELECT id FROM blog_posts WHERE id = $1',
      [postId]
    );

    if (postExists.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await pool.query(
      'INSERT INTO blog_post_views (post_id) VALUES ($1)',
      [postId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blog view tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
