import type { Pool } from 'pg';

export async function up(pgm: Pool) {
  pgm.sql(`ALTER TABLE jobs ALTER COLUMN description TYPE TEXT`);
  pgm.sql(`ALTER TABLE jobs ALTER COLUMN responsibilities TYPE TEXT`);
  pgm.sql(`ALTER TABLE jobs ALTER COLUMN requirements TYPE TEXT`);
  pgm.sql(`ALTER TABLE jobs ALTER COLUMN benefits TYPE TEXT`);
}

export async function down(pgm: Pool) {
  pgm.sql(`ALTER TABLE jobs ALTER COLUMN description TYPE JSONB USING description::jsonb`);
  pgm.sql(`ALTER TABLE jobs ALTER COLUMN responsibilities TYPE JSONB USING responsibilities::jsonb`);
  pgm.sql(`ALTER TABLE jobs ALTER COLUMN requirements TYPE JSONB USING requirements::jsonb`);
  pgm.sql(`ALTER TABLE jobs ALTER COLUMN benefits TYPE JSONB USING benefits::jsonb`);
}
