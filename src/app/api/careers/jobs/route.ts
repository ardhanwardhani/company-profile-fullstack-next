import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withAuth, withMethods, ApiResponse } from '@/lib/api';
import { Job } from '@/types';
import { z } from 'zod';

const CreateJobSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.any(),
  responsibilities: z.any(),
  requirements: z.any(),
  benefits: z.any().optional(),
  department_id: z.string().uuid(),
  location_id: z.string().uuid(),
  employment_type: z.enum(['full-time', 'contract', 'intern']),
  level: z.enum(['junior', 'mid', 'senior']).optional(),
  apply_url: z.string().url().or(z.string().startsWith('mailto:')),
  status: z.enum(['draft', 'open', 'closed', 'archived']).default('draft'),
  seo_title: z.string().max(255).optional(),
  seo_description: z.string().max(500).optional(),
  seo_index: z.boolean().default(true),
});

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
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const status = searchParams.get('status');
      const department_id = searchParams.get('department_id');
      const location_id = searchParams.get('location_id');
      const employment_type = searchParams.get('employment_type');
      const search = searchParams.get('search');

      const offset = (page - 1) * limit;

      let whereConditions = ['1=1'];
      const params: any[] = [];
      let paramIndex = 1;

      if (status) {
        whereConditions.push(`j.status = $${paramIndex++}`);
        params.push(status);
      } else {
        whereConditions.push(`j.status IN ('open', 'closed')`);
      }

      if (department_id) {
        whereConditions.push(`j.department_id = $${paramIndex++}`);
        params.push(department_id);
      }

      if (location_id) {
        whereConditions.push(`j.location_id = $${paramIndex++}`);
        params.push(location_id);
      }

      if (employment_type) {
        whereConditions.push(`j.employment_type = $${paramIndex++}`);
        params.push(employment_type);
      }

      if (search) {
        whereConditions.push(`(j.title ILIKE $${paramIndex} OR j.description ILIKE $${paramIndex})`);
        params.push(`%${search}%`);
        paramIndex++;
      }

      const whereClause = whereConditions.join(' AND ');

      const countQuery = `SELECT COUNT(*) FROM jobs j WHERE ${whereClause}`;
      const countResult = await pool.query(countQuery, params);
      const total = parseInt(countResult.rows[0].count);

      const query = `
        SELECT 
          j.*,
          d.name as department_name,
          l.name as location_name,
          l.is_remote
        FROM jobs j
        LEFT JOIN departments d ON j.department_id = d.id
        LEFT JOIN locations l ON j.location_id = l.id
        WHERE ${whereClause}
        ORDER BY j.created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex}
      `;

      const result = await pool.query(query, [...params, limit, offset]);

      const jobs = result.rows.map(row => ({
        ...row,
        department: { id: row.department_id, name: row.department_name },
        location: { id: row.location_id, name: row.location_name, is_remote: row.is_remote },
      }));

      const response: ApiResponse<Job[]> = {
        success: true,
        data: jobs,
      };

      return NextResponse.json(response, {
        headers: {
          'X-Total-Count': total.toString(),
          'X-Total-Pages': Math.ceil(total / limit).toString(),
        },
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }
  }
);

export const POST = withMethods(['POST'])(
  async (context, req: NextRequest) => {
    try {
      if (!context.user || !['admin', 'hr'].includes(context.user.role)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      const body = await req.json();
      const validation = CreateJobSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { success: false, error: 'Invalid input', details: validation.error.flatten() },
          { status: 400 }
        );
      }

      const data = validation.data;
      let slug = generateSlug(data.title);

      const slugCheck = await pool.query('SELECT id FROM jobs WHERE slug = $1', [slug]);
      if (slugCheck.rows.length > 0) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }

      const published_at = data.status === 'open' ? new Date() : null;

      const result = await pool.query(
        `INSERT INTO jobs (title, slug, description, responsibilities, requirements, benefits,
                          department_id, location_id, employment_type, level, apply_url,
                          status, published_at, seo_title, seo_description, seo_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         RETURNING *`,
        [
          data.title,
          slug,
          JSON.stringify(data.description),
          JSON.stringify(data.responsibilities),
          JSON.stringify(data.requirements),
          data.benefits ? JSON.stringify(data.benefits) : null,
          data.department_id,
          data.location_id,
          data.employment_type,
          data.level,
          data.apply_url,
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
        message: 'Job listing created successfully',
      }, { status: 201 });
    } catch (error) {
      console.error('Error creating job:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create job' },
        { status: 500 }
      );
    }
  }
);
