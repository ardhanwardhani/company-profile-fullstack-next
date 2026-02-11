import type { Pool } from 'pg';

export async function up(pgm: Pool) {
  pgm.addColumn('blog_tags', {
    description: 'text',
  });

  pgm.addColumn('blog_tags', {
    is_active: { type: 'boolean', notNull: true, default: true },
  });

  pgm.addColumn('blog_tags', {
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });
}

export async function down(pgm: Pool) {
  pgm.dropColumn('blog_tags', 'description');
  pgm.dropColumn('blog_tags', 'is_active');
  pgm.dropColumn('blog_tags', 'updated_at');
}
