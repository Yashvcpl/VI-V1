require('dotenv').config();
const { Client } = require('@neondatabase/serverless');
(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query("select column_name from information_schema.columns where table_name = 'homepage_hero' order by ordinal_position");
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
})();