import type { Pool } from 'pg';

export async function up(pgm: Pool) {
  pgm.createTable('contact_submissions', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true },
    phone: { type: 'varchar(50)' },
    company: { type: 'varchar(255)' },
    project_type: { type: 'varchar(100)' },
    subject: { type: 'varchar(255)', notNull: true },
    message: { type: 'text', notNull: true },
    status: { type: 'varchar(20)', notNull: true, default: 'new' },
    notes: { type: 'text' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });

  pgm.createIndex('contact_submissions', 'email');
  pgm.createIndex('contact_submissions', 'status');
  pgm.createIndex('contact_submissions', 'created_at');
}

export async function down(pgm: Pool) {
  pgm.dropTable('contact_submissions', { ifExists: true, cascade: true });
}
