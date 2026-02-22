import { NextRequest, NextResponse } from 'next/server';
import { getProjects, getProjectCount, getProjectBySlug } from '@/lib/projects';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');

    const offset = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      getProjects({ status: 'published', limit, offset, category: category || undefined }),
      getProjectCount({ status: 'published', category: category || undefined })
    ]);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}
