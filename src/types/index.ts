export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  password_hash?: string;
  last_login_at?: Date;
  created_at: Date;
  updated_at?: Date;
}

export type UserRole = 'admin' | 'editor' | 'hr' | 'content_manager';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  featured_image?: string;
  category_id: string;
  author_id: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  published_at?: Date;
  seo_title?: string;
  seo_description?: string;
  seo_index: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
}

export interface BlogAuthor {
  id: string;
  name: string;
  bio?: string;
  avatar_id?: string;
  role?: string;
  is_active: boolean;
  created_at: Date;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  department_id: string;
  location_id: string;
  employment_type: 'full-time' | 'contract' | 'intern';
  level?: 'junior' | 'mid' | 'senior';
  description: any;
  responsibilities: any;
  requirements: any;
  benefits?: any;
  apply_url: string;
  status: 'draft' | 'open' | 'closed' | 'archived';
  published_at?: Date;
  seo_title?: string;
  seo_description?: string;
  seo_index: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Department {
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
}

export interface Location {
  id: string;
  name: string;
  is_remote: boolean;
  is_active: boolean;
  created_at: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
