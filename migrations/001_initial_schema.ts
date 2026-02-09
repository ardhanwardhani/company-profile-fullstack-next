import type { Pool } from 'pg';

export async function up(pgm: Pool) {
  pgm.createSchema('public', { ifNotExists: true });

  pgm.createTable('users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    username: { type: 'varchar(50)', unique: true, notNull: true },
    email: { type: 'varchar(255)', unique: true, notNull: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    name: { type: 'varchar(100)', notNull: true },
    role: { type: 'varchar(20)', notNull: true, check: "role IN ('admin', 'editor', 'hr', 'content_manager')" },
    status: { type: 'varchar(20)', notNull: true, default: 'active', check: "status IN ('active', 'inactive', 'suspended')" },
    avatar_url: 'varchar(500)',
    last_login_at: 'timestamp',
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });

  pgm.createTable('user_sessions', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', notNull: true, references: 'users(id)', onDelete: 'cascade' },
    token_hash: { type: 'varchar(255)', notNull: true },
    expires_at: { type: 'timestamp', notNull: true },
    ip_address: 'varchar(45)',
    user_agent: 'text',
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });

  pgm.createTable('user_activity_log', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', notNull: true, references: 'users(id)', onDelete: 'cascade' },
    action: { type: 'varchar(100)', notNull: true },
    resource_type: 'varchar(50)',
    resource_id: 'uuid',
    details: 'jsonb',
    ip_address: 'varchar(45)',
    user_agent: 'text',
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });

  pgm.createTable('blog_categories', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar(100)', notNull: true },
    slug: { type: 'varchar(100)', unique: true, notNull: true },
    description: 'text',
    is_active: { type: 'boolean', notNull: true, default: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });

  pgm.createTable('blog_tags', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar(50)', notNull: true },
    slug: { type: 'varchar(50)', unique: true, notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });

  pgm.createTable('blog_authors', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar(100)', notNull: true },
    bio: 'text',
    avatar_id: 'uuid',
    role: 'varchar(100)',
    is_active: { type: 'boolean', notNull: true, default: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });

  pgm.createTable('blog_posts', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    title: { type: 'varchar(255)', notNull: true },
    slug: { type: 'varchar(255)', unique: true, notNull: true },
    excerpt: { type: 'text', notNull: true },
    content: { type: 'jsonb', notNull: true },
    cover_image_id: 'uuid',
    category_id: { type: 'uuid', notNull: true, references: 'blog_categories(id)' },
    author_id: { type: 'uuid', notNull: true, references: 'blog_authors(id)' },
    status: { type: 'varchar(20)', notNull: true, check: "status IN ('draft', 'review', 'published', 'archived')" },
    published_at: 'timestamp',
    seo_title: 'varchar(255)',
    seo_description: 'varchar(500)',
    seo_index: { type: 'boolean', notNull: true, default: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });

  pgm.createTable('blog_post_tags', {
    post_id: { type: 'uuid', notNull: true, references: 'blog_posts(id)', onDelete: 'cascade' },
    tag_id: { type: 'uuid', notNull: true, references: 'blog_tags(id)', onDelete: 'cascade' }
  }, { ifNotExists: true });

  pgm.sql('ALTER TABLE blog_post_tags ADD PRIMARY KEY (post_id, tag_id)');

  pgm.createTable('departments', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar(100)', notNull: true },
    is_active: { type: 'boolean', notNull: true, default: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });

  pgm.createTable('locations', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar(100)', notNull: true },
    is_remote: { type: 'boolean', notNull: true, default: false },
    is_active: { type: 'boolean', notNull: true, default: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });

  pgm.createTable('jobs', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    title: { type: 'varchar(255)', notNull: true },
    slug: { type: 'varchar(255)', unique: true, notNull: true },
    description: { type: 'jsonb', notNull: true },
    responsibilities: { type: 'jsonb', notNull: true },
    requirements: { type: 'jsonb', notNull: true },
    benefits: 'jsonb',
    department_id: { type: 'uuid', notNull: true, references: 'departments(id)' },
    location_id: { type: 'uuid', notNull: true, references: 'locations(id)' },
    employment_type: { type: 'varchar(20)', notNull: true, check: "employment_type IN ('full-time', 'contract', 'intern')" },
    level: { type: 'varchar(20)', check: "level IN ('junior', 'mid', 'senior')" },
    apply_url: { type: 'varchar(500)', notNull: true },
    status: { type: 'varchar(20)', notNull: true, check: "status IN ('draft', 'open', 'closed', 'archived')" },
    published_at: 'timestamp',
    seo_title: 'varchar(255)',
    seo_description: 'varchar(500)',
    seo_index: { type: 'boolean', notNull: true, default: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });

  pgm.createTable('media_files', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    filename: { type: 'varchar(255)', notNull: true },
    original_name: { type: 'varchar(255)', notNull: true },
    mime_type: { type: 'varchar(100)', notNull: true },
    file_size: { type: 'bigint', notNull: true },
    folder_id: 'uuid',
    alt_text: 'text',
    metadata: 'jsonb',
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });

  pgm.createIndex('blog_posts', 'slug');
  pgm.createIndex('blog_posts', 'status');
  pgm.createIndex('blog_posts', 'created_at');
  pgm.createIndex('blog_posts', ['category_id', 'status']);
  pgm.createIndex('jobs', 'slug');
  pgm.createIndex('jobs', 'status');
  pgm.createIndex('jobs', ['department_id', 'status']);
  pgm.createIndex('jobs', ['location_id', 'status']);
  pgm.createIndex('users', 'email');
  pgm.createIndex('users', 'role');
}

export async function down(pgm: Pool) {
  pgm.dropTable('media_files', { ifExists: true, cascade: true });
  pgm.dropTable('jobs', { ifExists: true, cascade: true });
  pgm.dropTable('locations', { ifExists: true, cascade: true });
  pgm.dropTable('departments', { ifExists: true, cascade: true });
  pgm.dropTable('blog_post_tags', { ifExists: true, cascade: true });
  pgm.dropTable('blog_posts', { ifExists: true, cascade: true });
  pgm.dropTable('blog_authors', { ifExists: true, cascade: true });
  pgm.dropTable('blog_tags', { ifExists: true, cascade: true });
  pgm.dropTable('blog_categories', { ifExists: true, cascade: true });
  pgm.dropTable('user_activity_log', { ifExists: true, cascade: true });
  pgm.dropTable('user_sessions', { ifExists: true, cascade: true });
  pgm.dropTable('users', { ifExists: true, cascade: true });
}
