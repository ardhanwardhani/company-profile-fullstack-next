import pool from './db';

const PERMISSION_ROLES: Record<string, string[]> = {
  'settings.view': ['admin', 'content_manager'],
  'settings.edit': ['admin'],
  'analytics.view': ['admin', 'content_manager', 'hr'],
  'blog.create': ['admin', 'content_editor', 'content_manager'],
  'blog.edit': ['admin', 'content_editor', 'content_manager'],
  'blog.delete': ['admin', 'content_manager'],
  'blog.publish': ['admin', 'content_manager'],
  'blog.archive': ['admin', 'content_manager'],
  'jobs.create': ['admin', 'hr', 'content_manager'],
  'jobs.edit': ['admin', 'hr', 'content_manager'],
  'jobs.delete': ['admin', 'content_manager'],
  'jobs.open': ['admin', 'hr', 'content_manager'],
  'jobs.close': ['admin', 'hr', 'content_manager'],
  'jobs.archive': ['admin', 'content_manager'],
  'users.view': ['admin', 'content_manager'],
  'users.edit': ['admin'],
  'users.delete': ['admin'],
};

export async function getUserRole(userId: string): Promise<string> {
  const result = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
  return result.rows[0]?.role || 'viewer';
}

export async function checkPermission(userId: string, permission: string): Promise<boolean> {
  const role = await getUserRole(userId);
  const allowedRoles = PERMISSION_ROLES[permission];

  if (!allowedRoles) {
    return false;
  }

  return allowedRoles.includes(role);
}

export function hasRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole);
}
