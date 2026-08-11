import Image from "next/image";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { mediaAssets } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function MediaLibraryPage() {
  const assets: Array<{
    id: number;
    url: string;
    fileName: string;
    contentType?: string | null;
  }> = await db.select().from(mediaAssets).orderBy(desc(mediaAssets.uploadedAt)).catch(() => []);

  return (
    <div>
      <h1 className="text-2xl">Media Library</h1>
      <p className="mt-2 font-body text-ledger/70">
        Every file uploaded anywhere in the admin (page sections, services, team photos, etc.) is logged here for reference.
        Copy a URL to reuse an existing image instead of re-uploading it.
      </p>

      {assets.length === 0 ? (
        <p className="mt-8 font-body text-ledger/60">No files uploaded yet.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {assets.map((asset) => (
            <li key={asset.id} className="rounded-card border border-ledger/10 bg-paper p-2">
              {asset.contentType?.startsWith("image/") ? (
                <Image src={asset.url} alt={asset.fileName} width={200} height={200} className="aspect-square w-full rounded-card object-cover" />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-card bg-paper-dim font-mono text-xs text-ledger/50">
                  {asset.fileName.split(".").pop()?.toUpperCase()}
                </div>
              )}
              <p className="mt-2 truncate font-body text-xs text-ledger/70" title={asset.fileName}>{asset.fileName}</p>
              <a href={asset.url} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-growth-700 underline">
                Copy URL ↗
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
