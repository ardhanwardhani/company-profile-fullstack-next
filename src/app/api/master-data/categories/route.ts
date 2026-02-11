import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

const CategorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().max(500).optional().nullable(),
  is_active: z.boolean().default(true),
});

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let whereConditions = ['1=1'];
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      whereConditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (status === 'active') {
      whereConditions.push('is_active = true');
    } else if (status === 'inactive') {
      whereConditions.push('is_active = false');
    }

    const whereClause = whereConditions.join(' AND ');

    const countQuery = `SELECT COUNT(*) FROM blog_categories WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    const query = `SELECT * FROM blog_categories WHERE ${whereClause} ORDER BY name ASC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    const result = await pool.query(query, [...params, limit, offset]);

    return NextResponse.json(
      { success: true, data: result.rows },
      {
        headers: {
          'X-Total-Count': total.toString(),
          'X-Total-Pages': Math.ceil(total / limit).toString(),
        },
      }
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any)?.role;
    if (!['admin', 'hr_manager'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const validation = CategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const data = validation.data;
    let slug = data.slug || generateSlug(data.name);

    const slugCheck = await pool.query('SELECT id FROM blog_categories WHERE slug = $1', [slug]);
    if (slugCheck.rows.length > 0) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const result = await pool.query(
      `INSERT INTO blog_categories (name, slug, description, is_active) VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.name, slug, data.description, data.is_active]
    );

    return NextResponse.json({ success: true, data: result.rows[0], message: 'Category created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}
