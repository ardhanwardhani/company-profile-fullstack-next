import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT key, value, category FROM site_settings ORDER BY category, key');

    const settings: Record<string, Record<string, string>> = {};
    for (const row of result.rows) {
      if (!settings[row.category]) {
        settings[row.category] = {};
      }
      settings[row.category][row.key] = row.value || '';
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Public settings GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
