import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { getProjectById, updateProject } from '@/lib/projects';
import { z } from 'zod';

const statusSchema = z.object({
  status: z.enum(['draft', 'published']),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any)?.role;
    if (!['admin', 'content_manager'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const validation = statusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const existingProject = await getProjectById(id);
    if (!existingProject) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const updatedProject = await updateProject(id, { status: validation.data.status });

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: `Project ${validation.data.status === 'published' ? 'published' : 'unpublished'} successfully`,
    });
  } catch (error) {
    console.error('Error updating project status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update project status' }, { status: 500 });
  }
}
