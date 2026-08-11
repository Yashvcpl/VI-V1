import sharp from "sharp";

export async function resizeImageForBanner(buffer: Buffer, width: number, height: number): Promise<Buffer> {
  try {
    const resized = await sharp(buffer)
      .resize(width, height, {
        fit: "cover",
        position: "center",
      })
      .toBuffer();

    return resized;
  } catch (error) {
    console.error("Error resizing image:", error);
    throw new Error("Failed to resize image");
  }
}

/**
 * Optimize image for web (reduce file size)
 */
export async function optimizeImage(
  buffer: Buffer,
  format: "jpeg" | "webp" = "jpeg",
  quality: number = 80
): Promise<Buffer> {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (format === "webp") {
      return await image.webp({ quality }).toBuffer();
    }

    return await image.jpeg({ quality, progressive: true }).toBuffer();
  } catch (error) {
    console.error("Error optimizing image:", error);
    throw new Error("Failed to optimize image");
  }
}

/**
 * Resize and optimize in one step
 */
export async function processImageForBanner(buffer: Buffer, width = 1920, height = 850): Promise<Buffer> {
  const resized = await resizeImageForBanner(buffer, width, height);
  const optimized = await optimizeImage(resized, "jpeg", 85);
  return optimized;
}

export async function processImageForBannerDesktop(buffer: Buffer): Promise<Buffer> {
  // Desktop banner target per request: 1200x400
  return processImageForBanner(buffer, 1200, 400);
}
