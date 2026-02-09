import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pool } from '@/lib/db';
import { checkPermission } from '@/lib/permissions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasAccess = await checkPermission(session.user.id, 'analytics.view');
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [postsResult, jobsResult, usersResult, activityResult] = await Promise.all([
      pool.query(`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'published') as published_posts,
          COUNT(*) FILTER (WHERE status = 'draft') as draft_posts,
          COUNT(*) FILTER (WHERE status = 'archived') as archived_posts
        FROM blog_posts
      `),
      pool.query(`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'open') as open_jobs,
          COUNT(*) FILTER (WHERE status = 'closed') as closed_jobs,
          COUNT(*) FILTER (WHERE status = 'draft') as draft_jobs,
          COUNT(*) FILTER (WHERE status = 'archived') as archived_jobs
        FROM job_listings
      `),
      pool.query(`SELECT COUNT(*) as total_users FROM users WHERE is_active = true`),
      pool.query(`
        SELECT 
          COUNT(*) FILTER (WHERE action = 'post.created') as posts_created,
          COUNT(*) FILTER (WHERE action = 'post.published') as posts_published,
          COUNT(*) FILTER (WHERE action = 'job.created') as jobs_created,
          COUNT(*) FILTER (WHERE action = 'job.opened') as jobs_opened,
          COUNT(*) FILTER (WHERE action = 'job.closed') as jobs_closed
        FROM activity_logs
        WHERE created_at > NOW() - INTERVAL '7 days'
      `),
    ]);

    return NextResponse.json({
      blog: {
        published: parseInt(postsResult.rows[0].published_posts),
        draft: parseInt(postsResult.rows[0].draft_posts),
        archived: parseInt(postsResult.rows[0].archived_posts),
      },
      careers: {
        open: parseInt(jobsResult.rows[0].open_jobs),
        closed: parseInt(jobsResult.rows[0].closed_jobs),
        draft: parseInt(jobsResult.rows[0].draft_jobs),
        archived: parseInt(jobsResult.rows[0].archived_jobs),
      },
      users: parseInt(usersResult.rows[0].total_users),
      recentActivity: {
        postsCreated: parseInt(activityResult.rows[0].posts_created),
        postsPublished: parseInt(activityResult.rows[0].posts_published),
        jobsCreated: parseInt(activityResult.rows[0].jobs_created),
        jobsOpened: parseInt(activityResult.rows[0].jobs_opened),
        jobsClosed: parseInt(activityResult.rows[0].jobs_closed),
      },
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
