import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import pool from '@/lib/db';
import { checkPermission } from '@/lib/permissions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    console.log('User ID:', userId);

    const hasAccess = await checkPermission(userId, 'settings.view');
    console.log('Has access:', hasAccess);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await pool.query('SELECT key, value, category FROM site_settings ORDER BY category, key');
    console.log('Query result rows:', result.rows.length);

    const settings: Record<string, Record<string, string>> = {};
    for (const row of result.rows) {
      if (!settings[row.category]) {
        settings[row.category] = {};
      }
      settings[row.category][row.key] = row.value || '';
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    console.log('User ID for PUT:', userId);

    const hasAccess = await checkPermission(userId, 'settings.edit');
    console.log('Has access:', hasAccess);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const updates = body.settings as Record<string, Record<string, string>>;
    console.log('Updates:', updates);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const [category, settings] of Object.entries(updates)) {
        for (const [key, value] of Object.entries(settings)) {
          await client.query(`UPDATE site_settings SET value = $1, updated_at = NOW(), updated_by = $2 WHERE key = $3`, [value, userId, key]);
        }
      }

      await client.query('COMMIT');
      return NextResponse.json({ success: true });
    } catch (error: any) {
      await client.query('ROLLBACK');
      console.error('Settings PUT query error:', error);
      throw new Error(error.message || 'Database query failed');
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
