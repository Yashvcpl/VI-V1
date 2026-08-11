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

export function createStorageProvider(): StorageProvider {
  return new LocalStorageProvider();
}

export class LocalStorageProvider implements StorageProvider {
  constructor(private readonly options?: { rootDir?: string }) {}

  async upload(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const timestamp = Date.now();
    const uniqueName = `${timestamp}-${sanitizedName}`;
    const relativeDir = options.folder ? path.posix.join("uploads", options.folder) : "uploads";
    const absoluteDir = path.join(this.getRootDir(), "public", relativeDir);

    await fs.mkdir(absoluteDir, { recursive: true });

    const targetPath = path.join(absoluteDir, uniqueName);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(targetPath, fileBuffer);

    return {
      url: `/${path.posix.join(relativeDir, uniqueName)}`,
      fileName: uniqueName,
      contentType: file.type,
      storageKey: path.posix.join(relativeDir, uniqueName),
    };
  }

  private getRootDir() {
    return this.options?.rootDir ?? process.cwd();
  }
}
