import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withAuth, withMethods, ApiResponse } from '@/lib/api';
import { BlogPost } from '@/types';
import { z } from 'zod';

const CreatePostSchema = z.object({
  title: z.string().min(1).max(255),
  excerpt: z.string().min(1).max(500),
  content: z.any(),
  category_id: z.string().uuid(),
  author_id: z.string().uuid(),
  cover_image_id: z.string().uuid().optional(),
  status: z.enum(['draft', 'review', 'published', 'archived']).default('draft'),
  seo_title: z.string().max(255).optional(),
  seo_description: z.string().max(500).optional(),
  seo_index: z.boolean().default(true),
});

const UpdatePostSchema = CreatePostSchema.partial();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const GET = withMethods(['GET'])(
  async (context, req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      const slug = searchParams.get('slug');

      if (id) {
        const result = await pool.query(
          `SELECT bp.*, 
                  bc.name as category_name, bc.slug as category_slug,
                  ba.name as author_name, ba.bio as author_bio, ba.avatar_id as author_avatar
           FROM blog_posts bp
           LEFT JOIN blog_categories bc ON bp.category_id = bc.id
           LEFT JOIN blog_authors ba ON bp.author_id = ba.id
           WHERE bp.id = $1`,
          [id]
        );

        if (result.rows.length === 0) {
          return NextResponse.json(
            { success: false, error: 'Post not found' },
            { status: 404 }
          );
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
      }

      if (slug) {
        const result = await pool.query(
          `SELECT bp.*, 
                  bc.name as category_name, bc.slug as category_slug,
                  ba.name as author_name, ba.bio as author_bio, ba.avatar_id as author_avatar
           FROM blog_posts bp
           LEFT JOIN blog_categories bc ON bp.category_id = bc.id
           LEFT JOIN blog_authors ba ON bp.author_id = ba.id
           WHERE bp.slug = $1`,
          [slug]
        );

        if (result.rows.length === 0) {
          return NextResponse.json(
            { success: false, error: 'Post not found' },
            { status: 404 }
          );
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
      }

      return NextResponse.json(
        { success: false, error: 'ID or slug required' },
        { status: 400 }
      );
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch blog post' },
        { status: 500 }
      );
    }
  }
);

export const POST = withMethods(['POST'])(
  async (context, req: NextRequest) => {
    try {
      if (!context.user || !['admin', 'editor', 'content_manager'].includes(context.user.role)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      const body = await req.json();
      const validation = CreatePostSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { success: false, error: 'Invalid input', details: validation.error.flatten() },
          { status: 400 }
        );
      }

      const data = validation.data;
      let slug = generateSlug(data.title);

      const slugCheck = await pool.query('SELECT id FROM blog_posts WHERE slug = $1', [slug]);
      if (slugCheck.rows.length > 0) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }

      const published_at = data.status === 'published' ? new Date() : null;

      const result = await pool.query(
        `INSERT INTO blog_posts (title, slug, excerpt, content, category_id, author_id, cover_image_id, 
                                status, published_at, seo_title, seo_description, seo_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [
          data.title,
          slug,
          data.excerpt,
          JSON.stringify(data.content),
          data.category_id,
          data.author_id,
          data.cover_image_id,
          data.status,
          published_at,
          data.seo_title,
          data.seo_description,
          data.seo_index,
        ]
      );

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'Blog post created successfully',
      }, { status: 201 });
    } catch (error) {
      console.error('Error creating blog post:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create blog post' },
        { status: 500 }
      );
    }
  }
);

export const PUT = withMethods(['PUT'])(
  async (context, req: NextRequest) => {
    try {
      if (!context.user || !['admin', 'editor', 'content_manager'].includes(context.user.role)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Post ID required' },
          { status: 400 }
        );
      }

      const body = await req.json();
      const validation = UpdatePostSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { success: false, error: 'Invalid input', details: validation.error.flatten() },
          { status: 400 }
        );
      }

      const data = validation.data;
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'content') {
            updates.push(`${key} = $${paramIndex++}`);
            values.push(JSON.stringify(value));
          } else {
            updates.push(`${key} = $${paramIndex++}`);
            values.push(value);
          }
        }
      });

      updates.push(`updated_at = NOW()`);
      values.push(id);

      const result = await pool.query(
        `UPDATE blog_posts SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Post not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'Blog post updated successfully',
      });
    } catch (error) {
      console.error('Error updating blog post:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update blog post' },
        { status: 500 }
      );
    }
  }
);

export const PATCH = withMethods(['PATCH'])(
  async (context, req: NextRequest) => {
    try {
      if (!context.user || !['admin', 'content_manager'].includes(context.user.role)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Post ID required' },
          { status: 400 }
        );
      }

      const body = await req.json();
      const { status } = body;

      if (!['draft', 'review', 'published', 'archived'].includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status' },
          { status: 400 }
        );
      }

      const published_at = status === 'published' ? 'NOW()' : 'published_at';

      const result = await pool.query(
        `UPDATE blog_posts 
         SET status = $1, published_at = CASE WHEN $1 = 'published' THEN NOW() ELSE published_at END, updated_at = NOW()
         WHERE id = $2 
         RETURNING *`,
        [status, id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Post not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: `Post status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating post status:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update post status' },
        { status: 500 }
      );
    }
  }
);

export const DELETE = withMethods(['DELETE'])(
  async (context, req: NextRequest) => {
    try {
      if (!context.user || context.user.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: 'Admin access required' },
          { status: 403 }
        );
      }

      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Post ID required' },
          { status: 400 }
        );
      }

      const result = await pool.query('DELETE FROM blog_posts WHERE id = $1 RETURNING id', [id]);

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Post not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Blog post deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete blog post' },
        { status: 500 }
      );
    }
  }
);
