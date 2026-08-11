"use client";

import { useState } from "react";
import Image from "next/image";

interface BannerImage {
  url: string;
  alt?: string;
}

interface ImageGalleryFieldControlProps {
  field: { key: string; label: string };
  value: string | BannerImage[]; // Can be JSON string or array
  onChange: (value: string) => void; // Always return JSON string
}

export function ImageGalleryFieldControl({
  field,
  value,
  onChange,
}: ImageGalleryFieldControlProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse current images
  const images: BannerImage[] = parseImages(value);

  const moveImage = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const nextImages = [...images];
    [nextImages[index], nextImages[targetIndex]] = [nextImages[targetIndex], nextImages[index]];
    onChange(JSON.stringify(nextImages));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    setIsUploading(true);
    setError(null);

    try {
      const newImages: BannerImage[] = [...images];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "banner");

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Upload failed");
        }

        const { url } = await response.json();
        newImages.push({
          url,
          alt: file.name.replace(/\.[^.]+$/, ""),
        });
      }

      onChange(JSON.stringify(newImages));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
      e.currentTarget.value = ""; // Reset input
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(JSON.stringify(newImages));
  };

  const updateImageAlt = (index: number, alt: string) => {
    const newImages = [...images];
    newImages[index].alt = alt;
    onChange(JSON.stringify(newImages));
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ledger/10 bg-paper p-4">
      <div>
        <label htmlFor={field.key} className="text-sm font-medium text-ledger">
          {field.label}
        </label>
        <p className="text-xs text-ledger/50 mt-1">
          Upload multiple images for the banner carousel. Images will be automatically resized to 1920×850px.
        </p>
      </div>

      {/* Upload input */}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-ledger/10 bg-paper-dim hover:bg-ledger/5 cursor-pointer transition-colors">
          <input
            id={field.key}
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            className="hidden"
          />
          <span className="text-sm font-medium text-ledger">
            {isUploading ? "Uploading..." : "Add Images"}
          </span>
        </label>
        {images.length > 0 && (
          <p className="text-xs text-ledger/50">
            {images.length} image{images.length !== 1 ? "s" : ""} uploaded
          </p>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Image gallery */}
      {images.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-ledger/50">
            Banner Images ({images.length})
          </p>
          <div className="grid gap-3">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex gap-3 p-3 rounded-xl border border-ledger/10 bg-paper-dim"
              >
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-ledger/5">
                  <img
                    src={image.url}
                    alt={image.alt || `Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info and controls */}
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    placeholder="Image description/alt text"
                    value={image.alt || ""}
                    onChange={(e) => updateImageAlt(index, e.target.value)}
                    className="w-full text-sm px-2 py-1.5 rounded border border-ledger/10 bg-paper mb-2"
                  />
                  <p className="text-xs text-ledger/50 truncate">
                    {image.url.split("/").pop()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moveImage(index, -1)}
                      disabled={index === 0}
                      className="rounded-full border border-ledger/10 bg-paper px-2 py-2 text-sm text-ledger/70 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Move image ${index + 1} up`}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 1)}
                      disabled={index === images.length - 1}
                      className="rounded-full border border-ledger/10 bg-paper px-2 py-2 text-sm text-ledger/70 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Move image ${index + 1} down`}
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="flex-shrink-0 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Parse images from various formats
 */
function parseImages(value: string | BannerImage[]): BannerImage[] {
  if (!value) return [];

  if (typeof value === "string") {
    if (!value.trim()) return [];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((img) => img && typeof img.url === "string");
      }
    } catch {
      return [];
    }
  }

  if (Array.isArray(value)) {
    return value.filter((img) => img && typeof img.url === "string");
  }

  return [];
}
