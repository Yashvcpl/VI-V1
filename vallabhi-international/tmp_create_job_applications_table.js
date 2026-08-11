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
  return client.query(`CREATE TABLE IF NOT EXISTS job_applications (
    id serial PRIMARY KEY,
    job_id integer NOT NULL,
    full_name varchar(200) NOT NULL,
    email varchar(320) NOT NULL,
    phone varchar(30),
    current_location varchar(200),
    linkedin_url varchar(300),
    portfolio_url varchar(300),
    cover_letter text,
    resume_url text,
    status varchar(50) NOT NULL DEFAULT 'new',
    created_at timestamptz NOT NULL DEFAULT NOW()
  )`);
}).then((result) => {
  console.log('CREATED', result.command);
  return client.end();
}).catch((err) => {
  console.error('ERROR', err.message || err);
  client.end();
  process.exit(1);
});