require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  await sql`ALTER TABLE homepage_hero ADD COLUMN IF NOT EXISTS about_section_image_url text`;
  await sql`ALTER TABLE homepage_hero ADD COLUMN IF NOT EXISTS about_section_image_alt varchar(200)`;
  console.log('Added about_section_image_url and about_section_image_alt');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
