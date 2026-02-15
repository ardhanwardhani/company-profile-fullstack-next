import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        slug, 
        description, 
        is_active, 
        created_at 
      FROM blog_categories 
      WHERE is_active = true
      ORDER BY name ASC
    `);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog categories' },
      { status: 500 }
    );
  }
}
