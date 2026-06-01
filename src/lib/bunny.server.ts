import crypto from "node:crypto";

const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!;
const ACCESS_KEY = process.env.BUNNY_STORAGE_PASSWORD!;
const REGION = process.env.BUNNY_REGION || "de";
const CDN_URL = process.env.BUNNY_CDN_URL!;

type UploadKind = "video" | "thumbnail";

function getBunnyStorageEndpoint(objectPath: string) {
  return REGION === "de"
    ? `https://storage.bunnycdn.com/${STORAGE_ZONE}/${objectPath}`
    : `https://${REGION}.storage.bunnycdn.com/${STORAGE_ZONE}/${objectPath}`;
}

function buildFilename({
  fileName,
  kind,
  hint,
}: {
  fileName: string;
  kind: UploadKind;
  hint?: string;
}) {
  const extension = fileName.includes(".")
    ? fileName.split(".").pop()
    : kind === "video"
      ? "mp4"
      : "png";
  const baseName = `${hint || "asset"}-${crypto.randomUUID()}`
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${baseName}.${extension}`;
}

export function createBunnyUploadTarget({
  fileName,
  fileType,
  kind,
  hint,
}: {
  fileName: string;
  fileType: string;
  kind: UploadKind;
  hint?: string;
}) {
  const filename = buildFilename({ fileName, kind, hint });
  const folder = kind === "video" ? "videos" : "thumbnails";
  const objectPath = `${folder}/${filename}`;

  return {
    provider: "bunny" as const,
    path: objectPath,
    filename,
    uploadUrl: getBunnyStorageEndpoint(objectPath),
    publicUrl: `${CDN_URL}/${objectPath}`,
    headers: {
      AccessKey: ACCESS_KEY,
      "Content-Type": fileType || "application/octet-stream",
    },
  };
}

export class BunnyStorageProvider {
  provider = "bunny" as const;

  async upload({ file, kind, hint }: { file: File; kind: "video" | "thumbnail"; hint?: string }) {
    const target = createBunnyUploadTarget({
      fileName: file.name,
      fileType: file.type,
      kind,
      hint,
    });

    const response = await fetch(target.uploadUrl, {
      method: "PUT",
      headers: target.headers,
      body: file.stream(),
      duplex: "half",
    });

    if (!response.ok) {
      throw new Error(`Bunny upload failed: ${response.status}`);
    }

    return {
      provider: this.provider,
      path: target.path,
      url: target.publicUrl,
      filename: target.filename,
      bytes: file.size,
      mimeType: file.type,
    };
  }

  async delete(filePath: string) {
    const endpoint = getBunnyStorageEndpoint(filePath);

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
