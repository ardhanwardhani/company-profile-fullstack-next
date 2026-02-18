import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import pool from '@/lib/db';
import { checkPermission } from '@/lib/permissions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasAccess = await checkPermission((session.user as any).id, 'analytics.view');
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [
      postsResult,
      jobsResult,
      usersResult,
      activityResult,
      applicationsResult,
      blogViewsPerDay,
      blogViewsPerMonth,
      blogViewsPerYear,
      jobViewsPerDay,
      jobViewsPerMonth,
      jobViewsPerYear,
    ] = await Promise.all([
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
        FROM jobs
      `),
      pool.query(`SELECT COUNT(*) as total_users FROM users WHERE status = 'active'`),
      pool.query(`
        SELECT 
          COUNT(*) FILTER (WHERE action = 'post.created') as posts_created,
          COUNT(*) FILTER (WHERE action = 'post.published') as posts_published,
          COUNT(*) FILTER (WHERE action = 'job.created') as jobs_created,
          COUNT(*) FILTER (WHERE action = 'job.opened') as jobs_opened,
          COUNT(*) FILTER (WHERE action = 'job.closed') as jobs_closed
        FROM user_activity_log
        WHERE created_at > NOW() - INTERVAL '7 days'
      `),
      pool.query(`SELECT COUNT(*) as total_applications FROM job_applications`),
      pool.query(`
        SELECT DATE(viewed_at) as date, COUNT(*) as views
        FROM blog_post_views
        WHERE viewed_at > NOW() - INTERVAL '30 days'
        GROUP BY DATE(viewed_at)
        ORDER BY date
      `),
      pool.query(`
        SELECT TO_CHAR(viewed_at, 'YYYY-MM') as month, COUNT(*) as views
        FROM blog_post_views
        WHERE viewed_at > NOW() - INTERVAL '12 months'
        GROUP BY TO_CHAR(viewed_at, 'YYYY-MM')
        ORDER BY month
      `),
      pool.query(`
        SELECT EXTRACT(YEAR FROM viewed_at) as year, COUNT(*) as views
        FROM blog_post_views
        GROUP BY EXTRACT(YEAR FROM viewed_at)
        ORDER BY year
      `),
      pool.query(`
        SELECT DATE(viewed_at) as date, COUNT(*) as views
        FROM job_listing_views
        WHERE viewed_at > NOW() - INTERVAL '30 days'
        GROUP BY DATE(viewed_at)
        ORDER BY date
      `),
      pool.query(`
        SELECT TO_CHAR(viewed_at, 'YYYY-MM') as month, COUNT(*) as views
        FROM job_listing_views
        WHERE viewed_at > NOW() - INTERVAL '12 months'
        GROUP BY TO_CHAR(viewed_at, 'YYYY-MM')
        ORDER BY month
      `),
      pool.query(`
        SELECT EXTRACT(YEAR FROM viewed_at) as year, COUNT(*) as views
        FROM job_listing_views
        GROUP BY EXTRACT(YEAR FROM viewed_at)
        ORDER BY year
      `),
    ]);

    return NextResponse.json({
      stats: {
        blogPublished: parseInt(postsResult.rows[0].published_posts),
        blogDraft: parseInt(postsResult.rows[0].draft_posts),
        blogArchived: parseInt(postsResult.rows[0].archived_posts),
        jobActive: parseInt(jobsResult.rows[0].open_jobs),
        jobClosed: parseInt(jobsResult.rows[0].closed_jobs),
        jobDraft: parseInt(jobsResult.rows[0].draft_jobs),
        jobArchived: parseInt(jobsResult.rows[0].archived_jobs),
        totalUsers: parseInt(usersResult.rows[0].total_users),
        totalApplications: parseInt(applicationsResult.rows[0]?.total_applications || 0),
      },
      recentActivity: {
        postsCreated: parseInt(activityResult.rows[0].posts_created),
        postsPublished: parseInt(activityResult.rows[0].posts_published),
        jobsCreated: parseInt(activityResult.rows[0].jobs_created),
        jobsOpened: parseInt(activityResult.rows[0].jobs_opened),
        jobsClosed: parseInt(activityResult.rows[0].jobs_closed),
      },
      blogViews: {
        perDay: blogViewsPerDay.rows.map((row: any) => ({
          date: row.date,
          views: parseInt(row.views),
        })),
        perMonth: blogViewsPerMonth.rows.map((row: any) => ({
          month: row.month,
          views: parseInt(row.views),
        })),
        perYear: blogViewsPerYear.rows.map((row: any) => ({
          year: parseInt(row.year),
          views: parseInt(row.views),
        })),
      },
      jobViews: {
        perDay: jobViewsPerDay.rows.map((row: any) => ({
          date: row.date,
          views: parseInt(row.views),
        })),
        perMonth: jobViewsPerMonth.rows.map((row: any) => ({
          month: row.month,
          views: parseInt(row.views),
        })),
        perYear: jobViewsPerYear.rows.map((row: any) => ({
          year: parseInt(row.year),
          views: parseInt(row.views),
        })),
      },
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
