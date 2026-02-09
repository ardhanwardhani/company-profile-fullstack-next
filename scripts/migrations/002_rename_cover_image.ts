import type { Pool } from 'pg';

export async function up(pgm: Pool) {
  pgm.sql(`ALTER TABLE blog_posts RENAME COLUMN cover_image_id TO featured_image`);

  pgm.sql(`ALTER TABLE blog_posts ADD CONSTRAINT fk_blog_posts_featured_image FOREIGN KEY (featured_image) REFERENCES media_files(id) ON DELETE SET NULL`);
}

export async function down(pgm: Pool) {
  pgm.sql(`ALTER TABLE blog_posts DROP CONSTRAINT IF EXISTS fk_blog_posts_featured_image`);

  pgm.sql(`ALTER TABLE blog_posts RENAME COLUMN featured_image TO cover_image_id`);
}
