const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });
const conn = process.env.DATABASE_URL;
if (!conn) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}
(async () => {
  const client = new Client({ connectionString: conn });
  await client.connect();
  const cols = [
    'banner_image_url','banner_image_alt','banner_overlay_opacity','intro_heading','intro_body','offerings_section_title','offerings_section_subtitle','offerings','why_choose_heading','why_choose_items','cta_heading','cta_description','cta_button_text','published'
  ];
  const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name='services' AND column_name = ANY($1)", [cols]);
  console.log('present:', res.rows.map((r) => r.column_name).sort().join(','));
  await client.end();
})();
