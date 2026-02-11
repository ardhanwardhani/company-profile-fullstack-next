import type { Pool } from 'pg';

export async function up(pgm: Pool) {
  pgm.addColumn('departments', {
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });
}

export async function down(pgm: Pool) {
  pgm.dropColumn('departments', 'updated_at');
}
