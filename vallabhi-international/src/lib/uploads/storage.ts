import { put } from "@vercel/blob";

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

export function createStorageProvider(): StorageProvider {
  return new VercelBlobStorageProvider();
}

export class VercelBlobStorageProvider implements StorageProvider {
  async upload(
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");

    const timestamp = Date.now();

    const uniqueName = `${timestamp}-${sanitizedName}`;

    const pathname = options.folder
      ? `${options.folder}/${uniqueName}`
      : uniqueName;

    const token = process.env.VIBLOB_READ_WRITE_TOKEN;

    if (!token) {
      throw new Error(
        "VIBLOB_READ_WRITE_TOKEN is not configured"
      );
    }

    const blob = await put(pathname, file, {
      access: "public",
      token,
      contentType: file.type,
      addRandomSuffix: false,
    });

    return {
      url: blob.url,
      fileName: uniqueName,
      contentType: file.type,
      storageKey: pathname,
    };
  }
}
