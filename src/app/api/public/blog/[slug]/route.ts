import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const result = await pool.query(
      `SELECT bp.*, 
              bc.name as category_name, bc.slug as category_slug,
              ba.name as author_name, ba.bio as author_bio, ba.avatar_id as author_avatar
       FROM blog_posts bp
       LEFT JOIN blog_categories bc ON bp.category_id = bc.id
       LEFT JOIN blog_authors ba ON bp.author_id = ba.id
       WHERE bp.slug = $1 AND bp.status = 'published'`,
      [slug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const post = result.rows[0];
    return NextResponse.json({
      success: true,
      data: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featured_image: post.featured_image,
        status: post.status,
        created_at: post.created_at,
        updated_at: post.updated_at,
        published_at: post.published_at,
        category: { 
          id: post.category_id, 
          name: post.category_name, 
          slug: post.category_slug 
        },
        author: { 
          id: post.author_id, 
          name: post.author_name, 
          bio: post.author_bio, 
          avatar: post.author_avatar 
        },
      },
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blog post' }, { status: 500 });
  }
}
