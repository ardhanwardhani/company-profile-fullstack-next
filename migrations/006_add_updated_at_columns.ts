import type { Pool } from 'pg';

export async function up(pgm: Pool) {
  pgm.addColumn('blog_categories', {
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });

  pgm.addColumn('blog_authors', {
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });
}

export async function down(pgm: Pool) {
  pgm.dropColumn('blog_categories', 'updated_at');
  pgm.dropColumn('blog_authors', 'updated_at');
}
