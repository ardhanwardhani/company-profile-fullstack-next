import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import pool from '@/lib/db';
import path from 'path';
import fs from 'fs/promises';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    
    if (!session || userRole !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await params;
    const formData = await req.formData();
    const file = formData.get('avatar') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ success: false, error: 'Invalid file type. Allowed: jpg, jpeg, png, gif, webp' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'File too large. Maximum size: 2MB' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${userId}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    await pool.query(
      `UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2`,
      [fileName, userId]
    );

    return NextResponse.json({
      success: true,
      data: { fileName },
      message: 'Avatar uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload avatar' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    
    if (!session || userRole !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await params;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');

    const extensions = ALLOWED_EXTENSIONS.map(e => e.replace('.', ''));
    let deleted = false;

    for (const ext of extensions) {
      const filePath = path.join(uploadDir, `${userId}.${ext}`);
      try {
        await fs.unlink(filePath);
        deleted = true;
        break;
      } catch {
        continue;
      }
    }

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Avatar not found' }, { status: 404 });
    }

    await pool.query(
      `UPDATE users SET avatar_url = NULL, updated_at = NOW() WHERE id = $1`,
      [userId]
    );

    return NextResponse.json({ success: true, message: 'Avatar deleted successfully' });
  } catch (error) {
    console.error('Error deleting avatar:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete avatar' }, { status: 500 });
  }
}
