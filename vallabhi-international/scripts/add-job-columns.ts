import 'dotenv/config';
import { Client } from 'pg';

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();

  const sql = `ALTER TABLE job_openings
    ADD COLUMN IF NOT EXISTS summary varchar(500),
    ADD COLUMN IF NOT EXISTS experience varchar(100),
    ADD COLUMN IF NOT EXISTS salary varchar(100),
    ADD COLUMN IF NOT EXISTS responsibilities text,
    ADD COLUMN IF NOT EXISTS skills text,
    ADD COLUMN IF NOT EXISTS qualifications text,
    ADD COLUMN IF NOT EXISTS benefits text,
    ADD COLUMN IF NOT EXISTS application_deadline timestamp with time zone,
    ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS seo_title varchar(70),
    ADD COLUMN IF NOT EXISTS seo_description varchar(170),
    ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now();`;

  try {
    await c.query(sql);
    console.log('job_openings table updated');
  } catch (err) {
    console.error('failed to alter table:', err);
    process.exit(1);
  } finally {
    await c.end();
  }
}

main();
