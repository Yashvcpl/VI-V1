"use client";

import { useRef, useState } from "react";
import type { FieldConfig } from "@/lib/admin/entities";

interface Props {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif", ".bmp"];

function looksLikeImage(url: string) {
  if (!url) return false;
  const normalized = url.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => normalized.endsWith(ext)) || normalized.includes("/image/") || normalized.includes(".img");
}

export function ImageFieldControl({ field, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelection(file?: File) {
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    // If this field is the homepage desktop/mobile banner, tag the upload
    // so the server can resize to the appropriate target dimensions.
    if (field.key === "bannerDesktopImageUrl") {
      formData.append("folder", "banner-desktop");
    } else if (field.key === "bannerMobileImageUrl") {
      formData.append("folder", "banner-mobile");
    } else if (field.key === "bannerImageUrl") {
      formData.append("folder", "banner");
    }

    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError((data as { error?: string }).error ?? "Upload failed");
        return;
      }
      onChange((data as { url?: string }).url ?? "");
    } catch {
      setError("Upload failed - check your connection.");
    } finally {
      setUploading(false);
    }
  }

  const hasValue = Boolean(value);
  const isPreviewableImage = looksLikeImage(value);

  return (
    <div className="rounded-[24px] border border-ledger/10 bg-paper p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <label className="text-sm font-medium text-ledger">{field.label}</label>
          {field.help ? <p className="mt-1 text-xs leading-6 text-ledger/50">{field.help}</p> : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center justify-center rounded-full border border-growth/20 bg-growth/10 px-3 py-2 text-sm font-medium text-growth-700 transition hover:bg-growth/20"
          >
            {hasValue ? "Replace Image" : "Add Image"}
          </button>
          {hasValue ? (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setError(null);
              }}
              className="inline-flex items-center justify-center rounded-full border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.bmp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFileSelection(file);
          event.target.value = "";
        }}
      />

      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      {uploading ? <p className="mt-3 text-sm text-ledger/60">Uploading…</p> : null}

      {hasValue ? (
        <div className="mt-4 rounded-2xl border border-ledger/10 bg-paper-dim p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ledger">Current asset</p>
              <p className="mt-1 break-all text-xs text-ledger/60">{value}</p>
            </div>
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-growth-700 hover:underline">
              Preview
            </a>
          </div>

          {isPreviewableImage ? (
            <div className="mt-3 overflow-hidden rounded-2xl border border-ledger/10 bg-paper">
              <img src={value} alt={field.label} className="h-48 w-full object-cover" />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-ledger/15 bg-paper-dim p-4 text-sm text-ledger/65">
          No image added yet. Use the action above to upload one.
        </div>
      )}
    </div>
  );
}
