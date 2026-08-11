import Image from "next/image";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { galleryImages as galleryTable } from "@/lib/db/schema";

export async function ImageGallerySection({ data, isFirstOnPage }: { data: { eyebrow?: string; heading: string }; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";
  const images: Array<{ id: string; imageUrl: string; caption?: string | null }> = await db
    .select()
    .from(galleryTable)
    .orderBy(asc(galleryTable.sortOrder))
    .catch(() => [] as Array<{ id: string; imageUrl: string; caption?: string | null }>);
  if (images.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container-content">
        {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
        <Heading className="mt-3 text-3xl">{data.heading}</Heading>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <li key={image.id}>
              <Image src={image.imageUrl} alt={image.caption ?? ""} width={400} height={400} className="aspect-square w-full rounded-card object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
