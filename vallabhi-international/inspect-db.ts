import 'dotenv/config';
import { desc, asc, eq } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './src/lib/db/schema';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('NO DATABASE_URL');
  process.exit(1);
}

const db = drizzle(neon(databaseUrl), { schema });

(async () => {
  const [page] = await db.select().from(schema.pages).where(eq(schema.pages.slug, 'about-us')).limit(1);
  console.log('page', page);
  if (!page) return;
  const sections = await db.select().from(schema.pageSections).where(eq(schema.pageSections.pageId, page.id)).orderBy(asc(schema.pageSections.sortOrder));
  console.log('sections count', sections.length);
  sections.forEach((s) => console.log({ id: s.id, type: s.type, visible: s.visible, sortOrder: s.sortOrder, data: s.data }));
  const gallery = await db.select().from(schema.galleryImages).orderBy(asc(schema.galleryImages.sortOrder));
  console.log('gallery count', gallery.length);
  gallery.slice(0, 20).forEach((g) => console.log({ id: g.id, imageUrl: g.imageUrl, caption: g.caption, sortOrder: g.sortOrder }));
})();
