import type { Pool } from 'pg';

export async function up(pgm: Pool) {
  pgm.sql(`ALTER TABLE blog_posts ALTER COLUMN content TYPE TEXT`);
}

export async function down(pgm: Pool) {
  pgm.sql(`ALTER TABLE blog_posts ALTER COLUMN content TYPE JSONB USING content::jsonb`);
}
