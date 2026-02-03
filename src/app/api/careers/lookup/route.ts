import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withAuth, withMethods, ApiResponse } from '@/lib/api';
import { Department, Location } from '@/types';

export const GET = withMethods(['GET'])(
  async (context, req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const type = searchParams.get('type');

      if (type === 'departments') {
        const result = await pool.query(
          'SELECT id, name, is_active, created_at FROM departments WHERE is_active = true ORDER BY name'
        );
        return NextResponse.json({
          success: true,
          data: result.rows,
        });
      }

      if (type === 'locations') {
        const result = await pool.query(
          'SELECT id, name, is_remote, is_active, created_at FROM locations WHERE is_active = true ORDER BY name'
        );
        return NextResponse.json({
          success: true,
          data: result.rows,
        });
      }

      const [departments, locations] = await Promise.all([
        pool.query('SELECT id, name, is_active, created_at FROM departments WHERE is_active = true ORDER BY name'),
        pool.query('SELECT id, name, is_remote, is_active, created_at FROM locations WHERE is_active = true ORDER BY name'),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          departments: departments.rows,
          locations: locations.rows,
        },
      });
    } catch (error) {
      console.error('Error fetching lookup data:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch lookup data' },
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
      const { type, name, is_remote } = body;

      if (!name) {
        return NextResponse.json(
          { success: false, error: 'Name is required' },
          { status: 400 }
        );
      }

      if (type === 'department') {
        const result = await pool.query(
          'INSERT INTO departments (name) VALUES ($1) RETURNING id, name, is_active, created_at',
          [name]
        );
        return NextResponse.json({
          success: true,
          data: result.rows[0],
          message: 'Department created successfully',
        }, { status: 201 });
      }

      if (type === 'location') {
        const result = await pool.query(
          'INSERT INTO locations (name, is_remote) VALUES ($1, $2) RETURNING id, name, is_remote, is_active, created_at',
          [name, is_remote || false]
        );
        return NextResponse.json({
          success: true,
          data: result.rows[0],
          message: 'Location created successfully',
        }, { status: 201 });
      }

      return NextResponse.json(
        { success: false, error: 'Invalid type' },
        { status: 400 }
      );
    } catch (error) {
      console.error('Error creating lookup data:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create lookup data' },
        { status: 500 }
      );
    }
  }
);
