require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('Adding status column to leads table...');
    const result = await sql('ALTER TABLE leads ADD COLUMN IF NOT EXISTS status varchar(30) NOT NULL DEFAULT \'new\'');
    console.log('✓ Status column added successfully');
    process.exit(0);
  } catch(e) {
    console.error('✗ Error:', e.message);
    process.exit(1);
  }
}

main();
