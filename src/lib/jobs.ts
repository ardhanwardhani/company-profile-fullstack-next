import pool from './db';

export interface JobWithRelations {
  id: string;
  title: string;
  slug: string;
  description: any;
  responsibilities: any;
  requirements: any;
  benefits?: any;
  status: string;
  employment_type: string;
  level?: string;
  apply_url: string;
  published_at?: Date;
  created_at: Date;
  department?: { id: string; name: string };
  location?: { id: string; name: string; is_remote: boolean };
}

export async function getJobs(options: {
  status?: string;
  limit?: number;
  offset?: number;
  departmentId?: string;
  locationId?: string;
  employmentType?: string;
  search?: string;
} = {}): Promise<JobWithRelations[]> {
  const { status, limit = 10, offset = 0, departmentId, locationId, employmentType, search } = options;

  let whereConditions = ['1=1'];
  const params: any[] = [];
  let paramIndex = 1;

  if (status) {
    whereConditions.push(`j.status = $${paramIndex++}`);
    params.push(status);
  }

  if (departmentId) {
    whereConditions.push(`j.department_id = $${paramIndex++}`);
    params.push(departmentId);
  }

  if (locationId) {
    whereConditions.push(`j.location_id = $${paramIndex++}`);
    params.push(locationId);
  }

  if (employmentType) {
    whereConditions.push(`j.employment_type = $${paramIndex++}`);
    params.push(employmentType);
  }

  if (search) {
    whereConditions.push(`(j.title ILIKE $${paramIndex} OR j.description ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = whereConditions.join(' AND ');

  const result = await pool.query(
    `SELECT j.*, d.name as department_name, l.name as location_name, l.is_remote
     FROM jobs j
     LEFT JOIN departments d ON j.department_id = d.id
     LEFT JOIN locations l ON j.location_id = l.id
     WHERE ${whereClause}
     ORDER BY j.created_at DESC
     LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
    [...params, limit, offset]
  );

  return result.rows.map(row => ({
    ...row,
    department: { id: row.department_id, name: row.department_name },
    location: { id: row.location_id, name: row.location_name, is_remote: row.is_remote },
  }));
}

export async function getJobBySlug(slug: string): Promise<JobWithRelations | null> {
  const result = await pool.query(
    `SELECT j.*, d.name as department_name, l.name as location_name, l.is_remote
     FROM jobs j
     LEFT JOIN departments d ON j.department_id = d.id
     LEFT JOIN locations l ON j.location_id = l.id
     WHERE j.slug = $1 AND j.status IN ('open', 'closed')`,
    [slug]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];

  return {
    ...row,
    department: { id: row.department_id, name: row.department_name },
    location: { id: row.location_id, name: row.location_name, is_remote: row.is_remote },
  };
}

export async function getDepartments() {
  const result = await pool.query(
    'SELECT * FROM departments WHERE is_active = true ORDER BY name'
  );
  return result.rows;
}

export async function getLocations() {
  const result = await pool.query(
    'SELECT * FROM locations WHERE is_active = true ORDER BY name'
  );
  return result.rows;
}
