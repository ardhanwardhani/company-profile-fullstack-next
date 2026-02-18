-- ============================================
-- COMPANY PROFILE CMS - COMPLETE DATABASE SCHEMA
-- Consolidated from all migrations
-- ============================================

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'editor', 'hr', 'content_manager')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    avatar_url VARCHAR(500),
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- User sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- User activity log
CREATE TABLE user_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- BLOG MODULE
-- ============================================

-- Blog categories
CREATE TABLE blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Blog tags
CREATE TABLE blog_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Blog authors
CREATE TABLE blog_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_id UUID,
    role VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Blog posts
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image UUID REFERENCES media_files(id) ON DELETE SET NULL,
    category_id UUID NOT NULL REFERENCES blog_categories(id),
    author_id UUID NOT NULL REFERENCES blog_authors(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'review', 'published', 'archived')),
    published_at TIMESTAMP,
    seo_title VARCHAR(255),
    seo_description VARCHAR(500),
    seo_index BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX idx_blog_posts_category_status ON blog_posts(category_id, status);

-- Blog post tags (pivot table)
CREATE TABLE blog_post_tags (
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- ============================================
-- CAREERS MODULE
-- ============================================

-- Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Locations
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    is_remote BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Jobs
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    requirements TEXT NOT NULL,
    benefits TEXT,
    department_id UUID NOT NULL REFERENCES departments(id),
    location_id UUID NOT NULL REFERENCES locations(id),
    employment_type VARCHAR(20) NOT NULL CHECK (employment_type IN ('full-time', 'contract', 'intern')),
    level VARCHAR(20) CHECK (level IN ('junior', 'mid', 'senior')),
    apply_url VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'open', 'closed', 'archived')),
    published_at TIMESTAMP,
    seo_title VARCHAR(255),
    seo_description VARCHAR(500),
    seo_index BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_slug ON jobs(slug);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_department_status ON jobs(department_id, status);
CREATE INDEX idx_jobs_location_status ON jobs(location_id, status);

-- ============================================
-- MEDIA FILES
-- ============================================

CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    folder_id UUID,
    alt_text TEXT,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- SITE SETTINGS
-- ============================================

CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_site_settings_category ON site_settings(category);
CREATE INDEX idx_site_settings_key ON site_settings(key);

-- Insert default site settings
INSERT INTO site_settings (key, value, category) VALUES
    ('company_name', 'A+ Digital', 'general'),
    ('site_title', 'A+ Digital - Company Profile', 'general'),
    ('site_tagline', 'Innovation for a Better Tomorrow', 'general'),
    ('contact_email', 'contact@aplus.com', 'general'),
    ('timezone', 'UTC', 'general'),
    ('date_format', 'MM/dd/yyyy', 'general'),
    ('about_excerpt', 'A+ Digital is a leading innovator in the industry.', 'company'),
    ('facebook_url', 'https://facebook.com/aplus', 'company'),
    ('twitter_url', 'https://twitter.com/aplus', 'company'),
    ('linkedin_url', 'https://linkedin.com/company/aplus', 'company'),
    ('instagram_url', '', 'company'),
    ('address', 'Ngamprah, Bandung Barat', 'company'),
    ('phone', '02212345678', 'company'),
    ('meta_title_template', '%title | A+ Digital', 'seo'),
    ('meta_description_default', 'Learn more about A+ Digital.', 'seo'),
    ('og_image_url', '', 'seo'),
    ('robots_default', 'index, follow', 'seo'),
    ('blog_enabled', 'true', 'features'),
    ('careers_enabled', 'true', 'features'),
    ('contact_form_enabled', 'false', 'features');

-- ============================================
-- CONTACT SUBMISSIONS
-- ============================================

CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    project_type VARCHAR(100),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);

-- ============================================
-- ANALYTICS TABLES
-- ============================================

-- Blog post views
CREATE TABLE blog_post_views (
    id SERIAL PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_post_views_post_id ON blog_post_views(post_id);
CREATE INDEX idx_blog_post_views_viewed_at ON blog_post_views(viewed_at);

-- Job listing views
CREATE TABLE job_listing_views (
    id SERIAL PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_listing_views_job_id ON job_listing_views(job_id);
CREATE INDEX idx_job_listing_views_viewed_at ON job_listing_views(viewed_at);

-- Job applications
CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(50),
    cover_letter TEXT,
    resume_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    notes TEXT,
    applied_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_applied_at ON job_applications(applied_at);

-- ============================================
-- SEED DATA (OPTIONAL)
-- ============================================

-- Create admin user (password: admin123)
-- Note: You'll need to hash the password with bcrypt before inserting
-- This is just a placeholder - use the seed script for actual data

-- Example: Insert admin user (password hash should be generated with bcrypt)
INSERT INTO users (username, email, password_hash, name, role, status)
VALUES ('admin', 'admin@company.com', '$2b$12$YourHashedPasswordHere', 'Admin User', 'admin', 'active');

-- Example: Insert blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
    ('Technology', 'technology', 'All posts about Technology'),
    ('Company News', 'company-news', 'All posts about Company News'),
    ('Engineering', 'engineering', 'All posts about Engineering'),
    ('Design', 'design', 'All posts about Design'),
    ('Culture', 'culture', 'All posts about Culture');

-- Example: Insert departments
INSERT INTO departments (name, is_active) VALUES
    ('Engineering', true),
    ('Product', true),
    ('Design', true),
    ('Marketing', true),
    ('Human Resources', true);

-- Example: Insert locations
INSERT INTO locations (name, is_remote, is_active) VALUES
    ('Jakarta', false, true),
    ('Bali', false, true),
    ('Remote', true, true);
