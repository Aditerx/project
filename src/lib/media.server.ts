import crypto from "node:crypto";
import path from "node:path";
import { createWriteStream } from "node:fs";
import { mkdir, rename, unlink, writeFile } from "node:fs/promises";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

import {
  createSeedThumbnailSvg,
  ensureStorageLayout,
  fileExists,
  formatBrandPath,
  normalizeSafeFileName,
  readJsonFile,
  resolveStoragePath,
  writeJsonFile,
  STORAGE_METADATA_FILE,
} from "./storage.server";

import type {
  MediaStorageProviderName,
  VideoRecord,
} from "./media.types";

export interface StorageUploadInput {
  file: File;
  kind: "video" | "thumbnail";
  hint?: string;
  onProgress?: (uploadedBytes: number, totalBytes: number) => void;
}

export interface StorageUploadResult {
  provider: MediaStorageProviderName;
  path: string;
  url: string;
  filename: string;
  bytes: number;
  mimeType: string;
}

export interface StorageProvider {
  upload(input: StorageUploadInput): Promise<StorageUploadResult>;
  delete(path: string): Promise<void>;
  getUrl(path: string): string;
}

const DEFAULT_MAX_VIDEO_BYTES = 10 * 1024 * 1024 * 1024;
const configuredMaxVideoBytes = Number(process.env.MEDIA_MAX_VIDEO_BYTES ?? DEFAULT_MAX_VIDEO_BYTES);
const MAX_VIDEO_BYTES = Number.isFinite(configuredMaxVideoBytes) && configuredMaxVideoBytes > 0
  ? configuredMaxVideoBytes
  : DEFAULT_MAX_VIDEO_BYTES;
const MAX_THUMBNAIL_BYTES = 1024 * 1024 * 10;
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);
const ALLOWED_VIDEO_EXTENSIONS = new Set([".mp4", ".webm"]);
const ALLOWED_THUMBNAIL_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
const ALLOWED_THUMBNAIL_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".svg"]);

function describeLimit(bytes: number) {
  const gigabyte = 1024 * 1024 * 1024;
  const megabyte = 1024 * 1024;

  if (bytes >= gigabyte && bytes % gigabyte === 0) {
    return `${bytes / gigabyte} GB`;
  }

  if (bytes >= gigabyte) {
    return `${(bytes / gigabyte).toFixed(1)} GB`;
  }

  if (bytes >= megabyte && bytes % megabyte === 0) {
    return `${bytes / megabyte} MB`;
  }

  return `${bytes} bytes`;
}

async function streamFileToPath({
  file,
  targetPath,
  maxBytes,
  onProgress,
}: {
  file: File;
  targetPath: string;
  maxBytes: number;
  onProgress?: (uploadedBytes: number, totalBytes: number) => void;
}) {
  const totalBytes = file.size;
  const tempPath = `${targetPath}.uploading`;

  await mkdir(path.dirname(targetPath), { recursive: true });

  let uploadedBytes = 0;
  const byteLimiter = new Transform({
    transform(chunk, _encoding, callback) {
      uploadedBytes += chunk.length;
      if (uploadedBytes > maxBytes) {
        callback(new Error(`File exceeds the ${describeLimit(maxBytes)} upload limit.`));
        return;
      }

      onProgress?.(uploadedBytes, totalBytes);
      callback(null, chunk);
    },
  });

  const source = Readable.fromWeb(file.stream());
  const destination = createWriteStream(tempPath, { flags: "wx" });

  try {
    await pipeline(source, byteLimiter, destination);
    await rename(tempPath, targetPath);
  } catch (error) {
    await unlink(tempPath).catch(() => undefined);
    throw error;
  }

  return uploadedBytes || totalBytes;
}

export class LocalStorageProvider implements StorageProvider {
  provider: MediaStorageProviderName = "local";

  async upload({ file, kind, hint, onProgress }: StorageUploadInput): Promise<StorageUploadResult> {
    const extension = path.extname(file.name).toLowerCase();

    if (kind === "video") {
      if (!ALLOWED_VIDEO_TYPES.has(file.type) || !ALLOWED_VIDEO_EXTENSIONS.has(extension)) {
        throw new Error("Only MP4 and WebM video uploads are allowed.");
      }
      if (file.size > MAX_VIDEO_BYTES) {
        throw new Error(`Video files must be ${describeLimit(MAX_VIDEO_BYTES)} or smaller.`);
      }
    } else {
      if (!ALLOWED_THUMBNAIL_TYPES.has(file.type) || !ALLOWED_THUMBNAIL_EXTENSIONS.has(extension)) {
        throw new Error("Only JPG, PNG, WebP, or SVG thumbnail uploads are allowed.");
      }
      if (file.size > MAX_THUMBNAIL_BYTES) {
        throw new Error("Thumbnail files must be 10 MB or smaller.");
      }
    }

    const safeBaseName = normalizeSafeFileName(hint || path.basename(file.name, extension) || "asset");
    const uniqueName = `${safeBaseName || "asset"}-${crypto.randomUUID()}${extension || (kind === "video" ? ".mp4" : ".png")}`;
    const targetPath = resolveStoragePath(kind === "video" ? "videos" : "thumbnails", uniqueName);

    const bytes = await streamFileToPath({
      file,
      targetPath,
      maxBytes: kind === "video" ? MAX_VIDEO_BYTES : MAX_THUMBNAIL_BYTES,
      onProgress,
    });

    return {
      provider: this.provider,
      path: targetPath,
      url: this.getUrl(targetPath),
      filename: uniqueName,
      bytes,
      mimeType: file.type,
    };
  }

  async delete(filePath: string) {
    try {
      await unlink(filePath);
    } catch (error) {
      const code = error && typeof error === "object" ? (error as { code?: string }).code : undefined;
      if (code !== "ENOENT") {
        throw error;
      }
    }
  }

  getUrl(filePath: string) {
    const normalized = path.relative(resolveStoragePath(), filePath).replace(/\\/g, "/");
    return `/storage/${normalized}`;
  }
}

export const localStorageProvider = new LocalStorageProvider();

let catalogSeedPromise: Promise<void> | undefined;

function seedVideos() {
  const now = new Date("2026-05-29T00:00:00.000Z").toISOString();
  return [
    {
      id: "vid_001",
      title: "Internal Briefing",
      description: "Confidential media sample prepared for the secure vault experience.",
      thumbnail: "/storage/thumbnails/internal-briefing.svg",
      videoUrl: "/storage/videos/internal-briefing.mp4",
      storageProvider: "local" as const,
      category: "Research",
      tags: ["internal", "secure", "briefing"],
      featured: true,
      sources: [{ label: "1080p", url: "/storage/videos/internal-briefing.mp4", mimeType: "video/mp4", provider: "local" as const }],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "vid_002",
      title: "Response Drill",
      description: "Operational exercise footage for incident response teams and internal stakeholders.",
      thumbnail: "/storage/thumbnails/response-drill.svg",
      videoUrl: "/storage/videos/response-drill.webm",
      storageProvider: "local" as const,
      category: "Operations",
      tags: ["drill", "response", "training"],
      featured: false,
      sources: [{ label: "720p", url: "/storage/videos/response-drill.webm", mimeType: "video/webm", provider: "local" as const }],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "vid_003",
      title: "Market Intelligence",
      description: "A curated intelligence cut highlighting the current enterprise media distribution queue.",
      thumbnail: "/storage/thumbnails/market-intelligence.svg",
      videoUrl: "/storage/videos/market-intelligence.mp4",
      storageProvider: "local" as const,
      category: "Distribution",
      tags: ["distribution", "insights", "featured"],
      featured: true,
      sources: [{ label: "1080p", url: "/storage/videos/market-intelligence.mp4", mimeType: "video/mp4", provider: "local" as const }],
      createdAt: now,
      updatedAt: now,
    },
  ] satisfies VideoRecord[];
}

async function seedThumbnailIfMissing(fileName: string, label: string, subtitle: string) {
  const filePath = resolveStoragePath("thumbnails", fileName);
  if (!(await fileExists(filePath))) {
    await writeFile(filePath, createSeedThumbnailSvg(label, subtitle), "utf8");
  }
}

export async function ensureMediaSeed() {
  if (!catalogSeedPromise) {
    catalogSeedPromise = (async () => {
      await ensureStorageLayout();

      await Promise.all([
        seedThumbnailIfMissing("internal-briefing.svg", "Internal Briefing", "Secure vault seed"),
        seedThumbnailIfMissing("response-drill.svg", "Response Drill", "Ops exercise seed"),
        seedThumbnailIfMissing("market-intelligence.svg", "Market Intelligence", "Distribution seed"),
      ]);

      if (!(await fileExists(STORAGE_METADATA_FILE))) {
        await writeJsonFile<VideoRecord[]>(STORAGE_METADATA_FILE, seedVideos());
      }
    })();
  }

  return catalogSeedPromise;
}

export async function readMediaCatalog() {
  await ensureMediaSeed();
  const payload = await readJsonFile<VideoRecord[]>(STORAGE_METADATA_FILE, seedVideos());
  return Array.isArray(payload) ? payload : [];
}

async function writeMediaCatalog(videos: VideoRecord[]) {
  await ensureMediaSeed();
  await writeJsonFile<VideoRecord[]>(STORAGE_METADATA_FILE, videos);
}

export function getCategoryBuckets(videos: VideoRecord[]) {
  return [...new Set(videos.map((video) => video.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function getTagBuckets(videos: VideoRecord[]) {
  return [...new Set(videos.flatMap((video) => video.tags))].sort((a, b) => a.localeCompare(b));
}

export async function listVideos() {
  const videos = await readMediaCatalog();
  return [...videos].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function getVideoById(id: string) {
  const videos = await readMediaCatalog();
  return videos.find((video) => video.id === id) ?? null;
}

function parseTags(rawValue: FormDataEntryValue | null) {
  if (typeof rawValue !== "string") return [];
  return rawValue
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

function readString(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : fallback;
}

function extractFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

async function maybeDeleteIfLocal(url: string) {
  if (!url.startsWith("/storage/")) return;
  const absolutePath = resolveStoragePath(url.replace(/^\/storage\//, ""));
  await localStorageProvider.delete(absolutePath);
}

export async function createVideoFromForm(formData: FormData) {
  const title = readString(formData, "title");
  const description = readString(formData, "description");
  const category = readString(formData, "category");
  const tags = parseTags(formData.get("tags"));
  const featured = readString(formData, "featured") === "true";
  const videoFile = extractFile(formData, "videoFile");
  const thumbnailFile = extractFile(formData, "thumbnailFile");

  if (!title || !description || !category) {
    throw new Error("Title, description, and category are required.");
  }

  if (!videoFile) {
    throw new Error("A video file is required.");
  }

  if (!thumbnailFile) {
    throw new Error("A thumbnail file is required.");
  }

  const [uploadedVideo, uploadedThumbnail] = await Promise.all([
    localStorageProvider.upload({ file: videoFile, kind: "video", hint: title }),
    localStorageProvider.upload({ file: thumbnailFile, kind: "thumbnail", hint: title }),
  ]);

  const now = new Date().toISOString();
  const video: VideoRecord = {
    id: `vid_${crypto.randomUUID().slice(0, 8)}`,
    title,
    description,
    thumbnail: uploadedThumbnail.url,
    videoUrl: uploadedVideo.url,
    storageProvider: uploadedVideo.provider,
    category,
    tags,
    featured,
    sources: [
      { label: "Primary", url: uploadedVideo.url, mimeType: uploadedVideo.mimeType, provider: uploadedVideo.provider },
    ],
    createdAt: now,
    updatedAt: now,
  };

  const videos = await listVideos();
  videos.unshift(video);
  await writeMediaCatalog(videos);
  return video;
}

export async function updateVideoFromForm(id: string, formData: FormData) {
  const videos = await listVideos();
  const existing = videos.find((video) => video.id === id);
  if (!existing) throw new Error("Video record not found.");

  const title = readString(formData, "title", existing.title);
  const description = readString(formData, "description", existing.description);
  const category = readString(formData, "category", existing.category);
  const tags = parseTags(formData.get("tags"));
  const featured = readString(formData, "featured") === "true";
  const videoFile = extractFile(formData, "videoFile");
  const thumbnailFile = extractFile(formData, "thumbnailFile");

  let nextVideoUrl = existing.videoUrl;
  let nextThumbnailUrl = existing.thumbnail;
  let nextProvider = existing.storageProvider;

  if (videoFile) {
    const uploaded = await localStorageProvider.upload({ file: videoFile, kind: "video", hint: title });
    nextVideoUrl = uploaded.url;
    nextProvider = uploaded.provider;
    await maybeDeleteIfLocal(existing.videoUrl);
  }

  if (thumbnailFile) {
    const uploaded = await localStorageProvider.upload({ file: thumbnailFile, kind: "thumbnail", hint: title });
    nextThumbnailUrl = uploaded.url;
    await maybeDeleteIfLocal(existing.thumbnail);
  }

  const updated: VideoRecord = {
    ...existing,
    title,
    description,
    category,
    tags: tags.length > 0 ? tags : existing.tags,
    featured,
    thumbnail: nextThumbnailUrl,
    videoUrl: nextVideoUrl,
    storageProvider: nextProvider,
    updatedAt: new Date().toISOString(),
  };

  const nextVideos = videos.map((video) => (video.id === id ? updated : video));
  await writeMediaCatalog(nextVideos);
  return updated;
}

export async function deleteVideoById(id: string) {
  const videos = await listVideos();
  const existing = videos.find((video) => video.id === id);
  if (!existing) throw new Error("Video record not found.");

  await Promise.all([maybeDeleteIfLocal(existing.videoUrl), maybeDeleteIfLocal(existing.thumbnail)]);
  const remaining = videos.filter((video) => video.id !== id);
  await writeMediaCatalog(remaining);
  return existing;
}

export async function getVaultStats() {
  const videos = await listVideos();
  const categories = getCategoryBuckets(videos);
  const tags = getTagBuckets(videos);

  return {
    totalVideos: videos.length,
    featuredVideos: videos.filter((video) => video.featured).length,
    categories: categories.length,
    tags: tags.length,
    localProvider: "local" as const,
  };
}

export function toSafeDownloadName(title: string) {
  return `${formatBrandPath(title || "asset")}.mp4`;
}
