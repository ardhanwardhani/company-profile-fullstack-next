import { UserRole } from '@/types';

export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  CONTENT_MANAGER: 'content_manager',
  HR: 'hr',
  HR_MANAGER: 'hr_manager',
  HR_STAFF: 'hr_staff',
} as const;

export type RoleKey = keyof typeof ROLES;
export type RoleValue = typeof ROLES[RoleKey];

export const ROLE_GROUPS = {
  CAN_ACCESS_DASHBOARD: [ROLES.ADMIN, ROLES.EDITOR, ROLES.CONTENT_MANAGER, ROLES.HR, ROLES.HR_MANAGER, ROLES.HR_STAFF],
  
  CAN_MANAGE_BLOG: [ROLES.ADMIN, ROLES.EDITOR, ROLES.CONTENT_MANAGER],
  CAN_PUBLISH_BLOG: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  CAN_DELETE_BLOG: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  
  CAN_MANAGE_JOBS: [ROLES.ADMIN, ROLES.HR, ROLES.HR_MANAGER, ROLES.CONTENT_MANAGER],
  CAN_PUBLISH_JOBS: [ROLES.ADMIN, ROLES.HR_MANAGER],
  
  CAN_MANAGE_MASTER_DATA: [ROLES.ADMIN, ROLES.HR_MANAGER, ROLES.HR_STAFF],
  CAN_MANAGE_MASTER_DATA_CATEGORIES: [ROLES.ADMIN, ROLES.EDITOR, ROLES.CONTENT_MANAGER],
  CAN_MANAGE_MASTER_DATA_TAGS: [ROLES.ADMIN, ROLES.EDITOR, ROLES.CONTENT_MANAGER],
  CAN_MANAGE_MASTER_DATA_AUTHORS: [ROLES.ADMIN, ROLES.EDITOR, ROLES.CONTENT_MANAGER],
  CAN_MANAGE_MASTER_DATA_DEPARTMENTS: [ROLES.ADMIN, ROLES.HR_MANAGER, ROLES.HR_STAFF],
  CAN_MANAGE_MASTER_DATA_LOCATIONS: [ROLES.ADMIN, ROLES.HR_MANAGER, ROLES.HR_STAFF],
  
  CAN_MANAGE_PROJECTS: [ROLES.ADMIN, ROLES.EDITOR, ROLES.CONTENT_MANAGER],
  CAN_PUBLISH_PROJECTS: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  
  CAN_MANAGE_USERS: [ROLES.ADMIN],
  CAN_VIEW_ANALYTICS: [ROLES.ADMIN, ROLES.CONTENT_MANAGER, ROLES.HR],
} as const;

export function hasRole(userRole: string, allowedRoles: readonly string[]): boolean {
  return allowedRoles.includes(userRole);
}

export function isAdmin(role: string): boolean {
  return role === ROLES.ADMIN;
}

export function isContentManager(role: string): boolean {
  return role === ROLES.CONTENT_MANAGER;
}

export function canPublish(role: string, entity: 'blog' | 'jobs' | 'projects'): boolean {
  switch (entity) {
    case 'blog':
      return (ROLE_GROUPS.CAN_PUBLISH_BLOG as readonly string[]).includes(role);
    case 'jobs':
      return (ROLE_GROUPS.CAN_PUBLISH_JOBS as readonly string[]).includes(role);
    case 'projects':
      return (ROLE_GROUPS.CAN_PUBLISH_PROJECTS as readonly string[]).includes(role);
    default:
      return false;
  }
}
