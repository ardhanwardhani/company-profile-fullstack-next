import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const result = await pool.query(`SELECT id, name FROM locations WHERE is_active = true ORDER BY name ASC`);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch locations' }, { status: 500 });
  }
}
