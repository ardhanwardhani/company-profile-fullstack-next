import type { Pool } from 'pg';

export async function up(pgm: Pool) {
  pgm.createTable('projects', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    title: { type: 'varchar(255)', notNull: true },
    slug: { type: 'varchar(255)', notNull: true },
    description: 'text',
    content: 'text',
    client_name: 'varchar(255)',
    category: 'varchar(100)',
    featured_image: 'text',
    images: 'text[]',
    technologies: 'text[]',
    live_url: 'text',
    case_study_url: 'text',
    status: { type: 'varchar(50)', notNull: true, default: 'draft' },
    seo_title: 'varchar(255)',
    seo_description: 'text',
    seo_index: { type: 'boolean', default: true },
    created_at: { type: 'timestamp', default: pgm.func('now()') },
    updated_at: { type: 'timestamp', default: pgm.func('now()') },
  });

  pgm.createIndex('projects', 'slug', { unique: true });
  pgm.createIndex('projects', 'status');
  pgm.createIndex('projects', 'category');
}

export async function down(pgm: Pool) {
  pgm.dropTable('projects', { ifExists: true, cascade: true });
}
