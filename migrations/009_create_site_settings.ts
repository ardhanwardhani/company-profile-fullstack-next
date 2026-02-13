import type { Pool } from 'pg';

export async function up(pgm: Pool) {
  pgm.createTable('site_settings', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    key: { type: 'varchar(100)', unique: true, notNull: true },
    value: 'text',
    category: { type: 'varchar(50)', notNull: true, default: 'general' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    updated_by: { type: 'uuid', references: 'users(id)' }
  });

  pgm.createIndex('site_settings', 'category');
  pgm.createIndex('site_settings', 'key');

  pgm.sql(`
    INSERT INTO site_settings (key, value, category) VALUES
    ('company_name', 'Acme Corporation', 'general'),
    ('site_title', 'Acme Corporation - Company Profile', 'general'),
    ('site_tagline', 'Innovation for a Better Tomorrow', 'general'),
    ('contact_email', 'contact@acme.com', 'general'),
    ('timezone', 'UTC', 'general'),
    ('date_format', 'MM/dd/yyyy', 'general'),
    ('about_excerpt', 'Acme Corporation is a leading innovator in the industry.', 'company'),
    ('facebook_url', 'https://facebook.com/acme', 'company'),
    ('twitter_url', 'https://twitter.com/acme', 'company'),
    ('linkedin_url', 'https://linkedin.com/company/acme', 'company'),
    ('instagram_url', '', 'company'),
    ('address', '', 'company'),
    ('phone', '', 'company'),
    ('meta_title_template', '%title | Acme Corporation', 'seo'),
    ('meta_description_default', 'Learn more about Acme Corporation.', 'seo'),
    ('og_image_url', '', 'seo'),
    ('robots_default', 'index, follow', 'seo'),
    ('blog_enabled', 'true', 'features'),
    ('careers_enabled', 'true', 'features'),
    ('contact_form_enabled', 'false', 'features')
  `);
}

export async function down(pgm: Pool) {
  pgm.dropTable('site_settings', { ifExists: true, cascade: true });
}
