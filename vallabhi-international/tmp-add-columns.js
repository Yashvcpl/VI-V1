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
  const columns = [
    ["banner_image_url", "text"],
    ["banner_image_alt", "varchar(200)"],
    ["banner_overlay_opacity", "integer"],
    ["intro_heading", "varchar(200)"],
    ["intro_body", "text"],
    ["offerings_section_title", "varchar(200)"],
    ["offerings_section_subtitle", "varchar(300)"],
    ["offerings", "text"],
    ["why_choose_heading", "varchar(200)"],
    ["why_choose_items", "text"],
    ["cta_heading", "varchar(200)"],
    ["cta_description", "text"],
    ["cta_button_text", "varchar(100)"],
    ["published", "boolean"]
  ];
  for (const [col, type] of columns) {
    const { rows } = await client.query(`SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='${col}'`);
    if (rows.length === 0) {
      let sql = `ALTER TABLE services ADD COLUMN ${col} ${type}`;
      if (col === "banner_overlay_opacity") sql += " DEFAULT 55";
      if (col === "published") sql += " DEFAULT true";
      await client.query(sql);
      console.log(`Added ${col}`);
    } else {
      console.log(`Exists ${col}`);
    }
  }
  await client.end();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
