import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { mediaAssets } from "@/lib/db/schema";
import { createStorageProvider } from "@/lib/uploads/storage";
import { processImageForBanner, processImageForBannerDesktop } from "@/lib/uploads/imageResizer";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

const BANNER_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const storageProvider = createStorageProvider();

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (max 10MB)" }, { status: 413 });
  }

  try {
    const folderValue = formData?.get("folder");
    const folder = typeof folderValue === "string" && folderValue.trim() ? folderValue : "content";
    
    // Process banner images: resize to fixed dimensions
    let uploadFile = file;
    if (BANNER_IMAGE_TYPES.has(file.type)) {
      const buffer = await file.arrayBuffer();
      let resizedBuffer: Buffer | null = null;

      if (folder === "banner-desktop") {
        resizedBuffer = await processImageForBannerDesktop(Buffer.from(buffer));
      } else if (folder === "banner") {
        // legacy carousel/banner uploads use the larger 1920x850 default
        resizedBuffer = await processImageForBanner(Buffer.from(buffer));
      }

      if (resizedBuffer) {
        const blob = new Blob([new Uint8Array(resizedBuffer)], { type: "image/jpeg" });
        uploadFile = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
          type: "image/jpeg",
        });
      }
    }

    const result = await storageProvider.upload(uploadFile, { folder });

    await db.insert(mediaAssets).values({ url: result.url, fileName: result.fileName, contentType: result.contentType }).catch((err: unknown) => {
      // Non-fatal: the upload itself succeeded, only the Media Library log failed.
      console.error("Failed to log media asset:", err);
    });

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
