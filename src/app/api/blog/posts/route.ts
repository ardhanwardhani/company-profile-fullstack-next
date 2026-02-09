import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

interface GetQuery {
  page?: number;
  limit?: number;
  status?: string;
  category_id?: string;
  author_id?: string;
  search?: string;
}

async function ensureAuthorExists(userId: string): Promise<string> {
  const checkResult = await pool.query(
    'SELECT id FROM blog_authors WHERE id = $1',
    [userId]
  );

  if (checkResult.rows.length > 0) {
    return checkResult.rows[0].id;
  }

  const userResult = await pool.query(
    'SELECT name, email FROM users WHERE id = $1',
    [userId]
  );

  if (userResult.rows.length === 0) {
    throw new Error('User not found');
  }

  const user = userResult.rows[0];

  const createResult = await pool.query(
    `INSERT INTO blog_authors (id, name, bio, role, is_active)
     VALUES ($1, $2, $3, $4, true)
     RETURNING id`,
    [userId, user.name, 'Auto-created author', 'Contributor']
  );

  return createResult.rows[0].id;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, slug, content, excerpt, category_id, status, featured_image } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id;

    const authorId = await ensureAuthorExists(userId);

    const result = await pool.query(
      `INSERT INTO blog_posts (title, slug, content, excerpt, category_id, status, featured_image, author_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [title, slug, content, excerpt || null, category_id || null, status || 'draft', featured_image || null, authorId]
    );

    const post = result.rows[0];

    return NextResponse.json({
      success: true,
      data: post,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category_id = searchParams.get('category_id');
    const author_id = searchParams.get('author_id');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    let whereConditions = ['1=1'];
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`bp.status = $${paramIndex++}`);
      params.push(status);
    }

    if (category_id) {
      whereConditions.push(`bp.category_id = $${paramIndex++}`);
      params.push(category_id);
    }

    if (author_id) {
      whereConditions.push(`bp.author_id = $${paramIndex++}`);
      params.push(author_id);
    }

    if (search) {
      whereConditions.push(`(bp.title ILIKE $${paramIndex} OR bp.excerpt ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    const countQuery = `SELECT COUNT(*) FROM blog_posts bp WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    const query = `
      SELECT 
        bp.*,
        bc.name as category_name,
        bc.slug as category_slug,
        ba.name as author_name,
        ba.avatar_id as author_avatar
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      LEFT JOIN blog_authors ba ON bp.author_id = ba.id
      WHERE ${whereClause}
      ORDER BY bp.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `;

    const result = await pool.query(query, [...params, limit, offset]);

    const posts = result.rows.map(row => ({
      ...row,
      category: {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
      },
      author: {
        id: row.author_id,
        name: row.author_name,
        avatar: row.author_avatar,
      },
    }));

    const response = {
      success: true,
      data: posts,
    };

    return NextResponse.json(response, {
      headers: {
        'X-Total-Count': total.toString(),
        'X-Total-Pages': Math.ceil(total / limit).toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
