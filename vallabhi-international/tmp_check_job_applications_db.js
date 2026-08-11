const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Client } = require('pg');

const envPath = path.resolve(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local not found');
  process.exit(1);
}
const env = dotenv.parse(fs.readFileSync(envPath));
console.log('ENV_PATH', envPath);
console.log('DATABASE_URL', env.DATABASE_URL ? env.DATABASE_URL.slice(0, 80) + '...' : 'undefined');

const client = new Client({ connectionString: env.DATABASE_URL });
client.connect().then(() => {
  return client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name='job_applications'");
}).then((result) => {
  console.log('FOUND', result.rows);
  return client.end();
}).catch((err) => {
  console.error('ERROR', err.message || err);
  client.end();
  process.exit(1);
});