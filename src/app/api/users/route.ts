import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const CreateUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'editor', 'hr', 'content_manager']),
});

const UpdateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'editor', 'hr', 'content_manager']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  avatar_url: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || !userRole || userRole !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let whereConditions = ['1=1'];
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      whereConditions.push(`(name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (role) {
      whereConditions.push(`role = $${paramIndex}`);
      params.push(role);
      paramIndex++;
    }

    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    const countQuery = `SELECT COUNT(*) FROM users WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    const query = `
      SELECT id, username, name, email, role, status, avatar_url, last_login_at, created_at, updated_at
      FROM users
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `;
    const result = await pool.query(query, [...params, limit, offset]);

    return NextResponse.json(
      { success: true, data: result.rows },
      {
        headers: {
          'X-Total-Count': total.toString(),
          'X-Total-Pages': Math.ceil(total / limit).toString(),
        },
      },
    );
  } catch (error) {
    console.error('[GET USERS] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || userRole !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validation = CreateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const data = validation.data;

    const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1', [data.email]);
    if (emailCheck.rows.length > 0) {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 409 });
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const username = data.email.split('@')[0] + '_' + Date.now().toString(36).slice(-4);

    const result = await pool.query(
      `INSERT INTO users (username, name, email, password_hash, role, avatar_url, status)
       VALUES ($1, $2, $3, $4, $5, NULL, 'active')
       RETURNING id, username, name, email, role, status, avatar_url, last_login_at, created_at`,
      [username, data.name, data.email, passwordHash, data.role],
    );

    return NextResponse.json({ success: true, data: result.rows[0], message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
  }
}
