import { put } from "@vercel/blob";
import fs from "node:fs/promises";
import path from "node:path";

export interface UploadResult {
  url: string;
  fileName: string;
  contentType: string;
  storageKey: string;
}

export interface UploadOptions {
  folder?: string;
}

export interface StorageProvider {
  upload(file: File, options?: UploadOptions): Promise<UploadResult>;
}

/**
 * Creates the appropriate storage provider.
 *
 * On Vercel:
 * - Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is configured.
 *
 * Locally:
 * - Falls back to local public/uploads storage when the Blob token
 *   is not configured.
 */
export function createStorageProvider(): StorageProvider {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return new VercelBlobStorageProvider();
  }

  return new LocalStorageProvider();
}

/**
 * Vercel Blob storage provider.
 *
 * Used in production when BLOB_READ_WRITE_TOKEN is configured.
 */
export class VercelBlobStorageProvider implements StorageProvider {
  async upload(
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");

    const timestamp = Date.now();

    const fileName = `${timestamp}-${sanitizedName}`;

    const storageKey = options.folder
      ? `${options.folder}/${fileName}`
      : fileName;

    const blob = await put(storageKey, file, {
      access: "public",
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return {
      url: blob.url,
      fileName,
      contentType: file.type,
      storageKey,
    };
  }
}

/**
 * Local filesystem storage provider.
 *
 * Used for local development when BLOB_READ_WRITE_TOKEN
 * is not configured.
 */
export class LocalStorageProvider implements StorageProvider {
  constructor(
    private readonly options?: {
      rootDir?: string;
    }
  ) {}

  async upload(
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");

    const timestamp = Date.now();

    const uniqueName = `${timestamp}-${sanitizedName}`;

    const relativeDir = options.folder
      ? path.posix.join("uploads", options.folder)
      : "uploads";

    const absoluteDir = path.join(
      this.getRootDir(),
      "public",
      relativeDir
    );

    await fs.mkdir(absoluteDir, {
      recursive: true,
    });

    const targetPath = path.join(
      absoluteDir,
      uniqueName
    );

    const fileBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    await fs.writeFile(
      targetPath,
      fileBuffer
    );

    return {
      url: `/${path.posix.join(
        relativeDir,
        uniqueName
      )}`,
      fileName: uniqueName,
      contentType: file.type,
      storageKey: path.posix.join(
        relativeDir,
        uniqueName
      ),
    };
  }

  private getRootDir(): string {
    return this.options?.rootDir ?? process.cwd();
  }
}