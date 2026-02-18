import type { Pool } from 'pg';

export async function up(pgm: Pool) {
  pgm.createTable('blog_post_views', {
    id: { type: 'serial', primaryKey: true },
    post_id: { type: 'integer', notNull: true },
    viewed_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });

  pgm.createTable('job_listing_views', {
    id: { type: 'serial', primaryKey: true },
    job_id: { type: 'integer', notNull: true },
    viewed_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });

  pgm.createTable('job_applications', {
    id: { type: 'serial', primaryKey: true },
    job_id: { type: 'integer', notNull: true },
    applicant_name: { type: 'varchar(255)', notNull: true },
    applicant_email: { type: 'varchar(255)', notNull: true },
    applicant_phone: { type: 'varchar(50)' },
    cover_letter: { type: 'text' },
    resume_url: { type: 'text' },
    status: { type: 'varchar(20)', notNull: true, default: 'pending' },
    notes: { type: 'text' },
    applied_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });

  pgm.createIndex('blog_post_views', 'post_id');
  pgm.createIndex('blog_post_views', 'viewed_at');
  pgm.createIndex('job_listing_views', 'job_id');
  pgm.createIndex('job_listing_views', 'viewed_at');
  pgm.createIndex('job_applications', 'job_id');
  pgm.createIndex('job_applications', 'status');
  pgm.createIndex('job_applications', 'applied_at');
}

export async function down(pgm: Pool) {
  pgm.dropTable('job_applications', { ifExists: true, cascade: true });
  pgm.dropTable('job_listing_views', { ifExists: true, cascade: true });
  pgm.dropTable('blog_post_views', { ifExists: true, cascade: true });
}
