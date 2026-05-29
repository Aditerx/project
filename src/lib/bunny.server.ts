import crypto from "node:crypto";
import { Buffer } from "node:buffer";

const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!;
const ACCESS_KEY = process.env.BUNNY_STORAGE_PASSWORD!;
const REGION = process.env.BUNNY_REGION || "de";
const CDN_URL = process.env.BUNNY_CDN_URL!;

export class BunnyStorageProvider {
  provider = "bunny" as const;

  async upload({
    file,
    kind,
    hint,
  }: {
    file: File;
    kind: "video" | "thumbnail";
    hint?: string;
  }) {
    const extension = file.name.split(".").pop();
    const filename =
      `${hint || "asset"}-${crypto.randomUUID()}.${extension}`
        .replace(/\s+/g, "-")
        .toLowerCase();

    const folder = kind === "video" ? "videos" : "thumbnails";

    const objectPath = `${folder}/${filename}`;

    const endpoint =
      REGION === "de"
        ? `https://storage.bunnycdn.com/${STORAGE_ZONE}/${objectPath}`
        : `https://${REGION}.storage.bunnycdn.com/${STORAGE_ZONE}/${objectPath}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        AccessKey: ACCESS_KEY,
        "Content-Type": file.type,
      },
      body: buffer,
    });

    if (!response.ok) {
      throw new Error(`Bunny upload failed: ${response.status}`);
    }

    return {
      provider: this.provider,
      path: objectPath,
      url: `${CDN_URL}/${objectPath}`,
      filename,
      bytes: file.size,
      mimeType: file.type,
    };
  }

  async delete(filePath: string) {
    const endpoint =
      REGION === "de"
        ? `https://storage.bunnycdn.com/${STORAGE_ZONE}/${filePath}`
        : `https://${REGION}.storage.bunnycdn.com/${STORAGE_ZONE}/${filePath}`;

    await fetch(endpoint, {
      method: "DELETE",
      headers: {
        AccessKey: ACCESS_KEY,
      },
    });
  }

  getUrl(filePath: string) {
    return `${CDN_URL}/${filePath}`;
  }
}

export const bunnyStorageProvider = new BunnyStorageProvider();