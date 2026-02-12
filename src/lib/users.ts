import pool from '@/lib/db';
import { User } from '@/types';

export async function getUsers(params: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ users: User[]; total: number; totalPages: number }> {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const offset = (page - 1) * limit;

  let whereConditions = ['1=1'];
  const paramsList: any[] = [];
  let paramIndex = 1;

  if (params.search) {
    whereConditions.push(`(name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
    paramsList.push(`%${params.search}%`);
    paramIndex++;
  }

  if (params.role) {
    whereConditions.push(`role = $${paramIndex}`);
    paramsList.push(params.role);
    paramIndex++;
  }

  if (params.status) {
    whereConditions.push(`status = $${paramIndex}`);
    paramsList.push(params.status);
    paramIndex++;
  }

  const whereClause = whereConditions.join(' AND ');

  const countQuery = `SELECT COUNT(*) FROM users WHERE ${whereClause}`;
  const countResult = await pool.query(countQuery, paramsList);
  const total = parseInt(countResult.rows[0].count);

  const query = `
    SELECT id, username, name, email, role, status, avatar_url, last_login_at, created_at, updated_at
    FROM users
    WHERE ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramIndex++} OFFSET $${paramIndex}
  `;

  const result = await pool.query(query, [...paramsList, limit, offset]);

  return {
    users: result.rows,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getUserById(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${id}`, { cache: 'no-store' });

  if (!res.ok) return null;

  const data = await res.json();
  return data.data || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar_id?: string;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create user');
  }

  return res.json();
}

export async function updateUser(id: string, data: {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  avatar_id?: string;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update user');
  }

  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete user');
  }

  return res.json();
}
