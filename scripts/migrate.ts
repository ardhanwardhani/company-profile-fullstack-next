import pool from '../src/lib/db';

async function migrate() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'editor', 'hr', 'content_manager')),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
        avatar_url VARCHAR(500),
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Creating user sessions table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Creating user activity log table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_activity_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(50),
        resource_id UUID,
        details JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Creating blog categories table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Creating blog tags table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL,
        slug VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Creating blog authors table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_authors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        bio TEXT,
        avatar_id UUID,
        role VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Creating blog posts table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT NOT NULL,
        content JSONB NOT NULL,
        featured_image UUID,
        category_id UUID REFERENCES blog_categories(id),
        author_id UUID REFERENCES blog_authors(id),
        status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'review', 'published', 'archived')),
        published_at TIMESTAMP,
        seo_title VARCHAR(255),
        seo_description VARCHAR(500),
        seo_index BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Creating post-tag relationship table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_post_tags (
        post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
        tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, tag_id)
      )
    `);

    console.log('Creating departments table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Creating locations table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        is_remote BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Creating jobs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description JSONB NOT NULL,
        responsibilities JSONB NOT NULL,
        requirements JSONB NOT NULL,
        benefits JSONB,
        department_id UUID REFERENCES departments(id),
        location_id UUID REFERENCES locations(id),
        employment_type VARCHAR(20) NOT NULL CHECK (employment_type IN ('full-time', 'contract', 'intern')),
        level VARCHAR(20) CHECK (level IN ('junior', 'mid', 'senior')),
        apply_url VARCHAR(500) NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'open', 'closed', 'archived')),
        published_at TIMESTAMP,
        seo_title VARCHAR(255),
        seo_description VARCHAR(500),
        seo_index BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Creating media files table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_files (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        file_size BIGINT NOT NULL,
        folder_id UUID,
        alt_text TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Creating indexes...');
    await client.query(`CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_jobs_slug ON jobs(slug)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_jobs_department ON jobs(department_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);

    await client.query('COMMIT');
    console.log('Migration completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

migrate().catch(console.error);
