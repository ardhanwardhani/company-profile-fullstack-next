import pool from './db';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  client_name?: string;
  category?: string;
  featured_image?: string;
  images?: string[];
  technologies?: string[];
  live_url?: string;
  case_study_url?: string;
  status: string;
  seo_title?: string;
  seo_description?: string;
  seo_index?: boolean;
  created_at: Date;
  updated_at: Date;
}

export async function getProjects(options: {
  status?: string;
  limit?: number;
  offset?: number;
  category?: string;
  search?: string;
} = {}): Promise<Project[]> {
  const { status, limit = 10, offset = 0, category, search } = options;

  let whereConditions = ['1=1'];
  const params: any[] = [];
  let paramIndex = 1;

  if (status) {
    whereConditions.push(`status = $${paramIndex++}`);
    params.push(status);
  }

  if (category) {
    whereConditions.push(`category = $${paramIndex++}`);
    params.push(category);
  }

  if (search) {
    whereConditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR client_name ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = whereConditions.join(' AND ');

  const result = await pool.query(
    `SELECT * FROM projects WHERE ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
    [...params, limit, offset]
  );

  return result.rows;
}

export async function getProjectCount(options: {
  status?: string;
  category?: string;
  search?: string;
} = {}): Promise<number> {
  const { status, category, search } = options;

  let whereConditions = ['1=1'];
  const params: any[] = [];
  let paramIndex = 1;

  if (status) {
    whereConditions.push(`status = $${paramIndex++}`);
    params.push(status);
  }

  if (category) {
    whereConditions.push(`category = $${paramIndex++}`);
    params.push(category);
  }

  if (search) {
    whereConditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR client_name ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = whereConditions.join(' AND ');

  const result = await pool.query(
    `SELECT COUNT(*) FROM projects WHERE ${whereClause}`,
    params
  );

  return parseInt(result.rows[0].count);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const result = await pool.query('SELECT * FROM projects WHERE slug = $1 AND status = $2', [slug, 'published']);
  return result.rows[0] || null;
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  const {
    title,
    slug,
    description,
    content,
    client_name,
    category,
    featured_image,
    images,
    technologies,
    live_url,
    case_study_url,
    status = 'draft',
    seo_title,
    seo_description,
    seo_index = true,
  } = data;

  const result = await pool.query(
    `INSERT INTO projects (title, slug, description, content, client_name, category, featured_image, images, technologies, live_url, case_study_url, status, seo_title, seo_description, seo_index, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
     RETURNING *`,
    [title, slug, description, content, client_name, category, featured_image, images, technologies, live_url, case_study_url, status, seo_title, seo_description, seo_index]
  );

  return result.rows[0];
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  const fields = [
    'title', 'slug', 'description', 'content', 'client_name', 'category',
    'featured_image', 'images', 'technologies', 'live_url', 'case_study_url',
    'status', 'seo_title', 'seo_description', 'seo_index'
  ];

  fields.forEach((field) => {
    if ((data as any)[field] !== undefined) {
      updates.push(`${field} = $${paramIndex++}`);
      values.push((data as any)[field]);
    }
  });

  if (updates.length === 0) {
    return getProjectById(id);
  }

  updates.push(`updated_at = NOW()`);
  values.push(id);

  const result = await pool.query(
    `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return result.rows[0] || null;
}

export async function deleteProject(id: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
  return result.rows.length > 0;
}

export async function getProjectCategories(): Promise<string[]> {
  const result = await pool.query('SELECT DISTINCT category FROM projects WHERE category IS NOT NULL ORDER BY category');
  return result.rows.map(row => row.category);
}
