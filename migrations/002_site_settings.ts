import { Pool } from 'pg';
import { Migration } from 'node-pg-migrate';

export const shortcuts = {
  createTable: (name: string, columns: string, constraints = '') =>
    `CREATE TABLE ${name} (${columns}${constraints ? ', ' + constraints : ''})`,
  dropTable: (name: string) => `DROP TABLE IF EXISTS ${name}`,
  addColumn: (table: string, column: string) =>
    `ALTER TABLE ${table} ADD COLUMN ${column}`,
};

export async function up(pool: Pool): Promise<void> {
  await pool.query(shortcuts.createTable(
    'site_settings',
    `
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      key VARCHAR(100) UNIQUE NOT NULL,
      value TEXT,
      category VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'company', 'seo', 'features')),
      updated_at TIMESTAMP DEFAULT NOW(),
      updated_by UUID REFERENCES users(id)
    `,
    ''
  ));

  await pool.query(`CREATE INDEX idx_site_settings_category ON site_settings(category)`);
  await pool.query(`CREATE INDEX idx_site_settings_key ON site_settings(key)`);

  await pool.query(`
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

export async function down(pool: Pool): Promise<void> {
  await pool.query('DROP TABLE site_settings');
}
