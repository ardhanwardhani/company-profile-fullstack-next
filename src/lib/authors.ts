import pool from './db';

export interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar_id?: string;
  role?: string;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date;
}

export async function getAuthors(options: {
  search?: string;
  status?: 'active' | 'inactive';
  limit?: number;
  offset?: number;
} = {}): Promise<Author[]> {
  const { search, status, limit = 20, offset = 0 } = options;

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

  const result = await pool.query(
    `SELECT * FROM blog_authors WHERE ${whereClause} ORDER BY name ASC LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
    [...params, limit, offset]
  );

  return result.rows;
}

export async function getAuthorById(id: string): Promise<Author | null> {
  const result = await pool.query('SELECT * FROM blog_authors WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getActiveAuthors(): Promise<Author[]> {
  const result = await pool.query(
    'SELECT * FROM blog_authors WHERE is_active = true ORDER BY name ASC'
  );
  return result.rows;
}
