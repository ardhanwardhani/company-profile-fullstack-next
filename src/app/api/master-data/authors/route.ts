import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

const AuthorSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(1000).optional().nullable(),
  role: z.string().max(100).optional().nullable(),
  avatar_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean().default(true),
});

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
      whereConditions.push(`(name ILIKE $${paramIndex} OR bio ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (status === 'active') {
      whereConditions.push('is_active = true');
    } else if (status === 'inactive') {
      whereConditions.push('is_active = false');
    }

    const whereClause = whereConditions.join(' AND ');

    const countQuery = `SELECT COUNT(*) FROM blog_authors WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    const query = `SELECT * FROM blog_authors WHERE ${whereClause} ORDER BY name ASC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
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
    console.error('Error fetching authors:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch authors' }, { status: 500 });
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
    const validation = AuthorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const data = validation.data;

    const result = await pool.query(
      `INSERT INTO blog_authors (name, bio, role, avatar_id, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.name, data.bio, data.role, data.avatar_id, data.is_active]
    );

    return NextResponse.json({ success: true, data: result.rows[0], message: 'Author created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json({ success: false, error: 'Failed to create author' }, { status: 500 });
  }
}
