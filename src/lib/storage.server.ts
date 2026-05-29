import path from "node:path";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";

import { BRAND_NAME } from "./brand";

export const WORKSPACE_ROOT = process.cwd();
const LOCAL_DEVELOPMENT_STORAGE_ROOT = path.resolve(WORKSPACE_ROOT, "..", "ip-protection-storage");
const VERCEL_RUNTIME_STORAGE_ROOT = path.join("/tmp", "ip-protection-storage");

function resolveConfiguredStorageRoot() {
  const configuredRoot = process.env.MEDIA_STORAGE_PATH?.trim();
  const defaultRoot =
    process.env.VERCEL === "1" || process.env.NODE_ENV === "production"
      ? VERCEL_RUNTIME_STORAGE_ROOT
      : LOCAL_DEVELOPMENT_STORAGE_ROOT;
  const root = configuredRoot && configuredRoot.length > 0 ? configuredRoot : defaultRoot;
  return path.resolve(root);
}

export const STORAGE_ROOT = resolveConfiguredStorageRoot();
export const STORAGE_USERS_DIR = path.join(STORAGE_ROOT, "users");
export const STORAGE_METADATA_DIR = path.join(STORAGE_ROOT, "metadata");
export const STORAGE_VIDEOS_DIR = path.join(STORAGE_ROOT, "videos");
export const STORAGE_THUMBNAILS_DIR = path.join(STORAGE_ROOT, "thumbnails");
export const STORAGE_USERS_FILE = path.join(STORAGE_USERS_DIR, "users.json");
export const STORAGE_VIDEOS_FILE = path.join(STORAGE_METADATA_DIR, "videos.json");
export const STORAGE_METADATA_FILE = STORAGE_VIDEOS_FILE;

let bootstrapPromise: Promise<void> | undefined;

function isInsideStorageRoot(candidate: string) {
  const resolvedRoot = path.resolve(STORAGE_ROOT);
  const resolvedCandidate = path.resolve(candidate);
  return resolvedCandidate === resolvedRoot || resolvedCandidate.startsWith(`${resolvedRoot}${path.sep}`);
}

async function ensureDirectory(dir: string) {
  await mkdir(dir, { recursive: true });
}

export async function ensureStorageLayout() {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      // The storage tree is intentionally split into public asset folders and
      // private JSON data folders. That gives us one canonical local structure
      // while still letting middleware deny sensitive files from public access.
      await Promise.all([
        ensureDirectory(STORAGE_ROOT),
        ensureDirectory(STORAGE_USERS_DIR),
        ensureDirectory(STORAGE_METADATA_DIR),
        ensureDirectory(STORAGE_VIDEOS_DIR),
        ensureDirectory(STORAGE_THUMBNAILS_DIR),
      ]);
    })();
  }

  return bootstrapPromise;
}

export function resolveStoragePath(...segments: string[]) {
  const absolutePath = path.resolve(STORAGE_ROOT, ...segments);
  if (!isInsideStorageRoot(absolutePath)) {
    throw new Error(`Refusing to resolve path outside the storage root: ${absolutePath}`);
  }
  return absolutePath;
}

export function resolvePublicStorageUrl(...segments: string[]) {
  return `/storage/${segments.join("/").replace(/\\/g, "/")}`;
}

export async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  await ensureStorageLayout();

  try {
    const raw = await readFile(filePath, "utf8");
    if (!raw.trim()) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    const code = error && typeof error === "object" ? (error as { code?: string }).code : undefined;
    if (code === "ENOENT") return fallback;
    throw error;
  }
}

export async function writeJsonFile<T>(filePath: string, value: T) {
  await ensureStorageLayout();
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function fileExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function normalizeSafeFileName(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createSeedThumbnailSvg(label: string, subtitle: string) {
  const safeLabel = label.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeSubtitle = subtitle.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" role="img" aria-label="${safeLabel}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#111111" />
      <stop offset="50%" stop-color="#1b140f" />
      <stop offset="100%" stop-color="#ff6b00" stop-opacity="0.25" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ff8c42" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#ff8c42" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)" />
  <rect width="1280" height="720" fill="url(#glow)" />
  <g fill="none" stroke="rgba(255,255,255,0.10)">
    <path d="M0 120H1280M0 240H1280M0 360H1280M0 480H1280M0 600H1280" />
    <path d="M120 0V720M240 0V720M360 0V720M480 0V720M600 0V720M720 0V720M840 0V720M960 0V720M1080 0V720M1200 0V720" />
  </g>
  <rect x="80" y="80" width="560" height="360" rx="36" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.08)" />
  <circle cx="160" cy="160" r="42" fill="rgba(255,107,0,0.24)" />
  <circle cx="160" cy="160" r="18" fill="#ff6b00" />
  <text x="80" y="520" fill="#ffffff" font-family="Inter,Arial,sans-serif" font-size="58" font-weight="700">${safeLabel}</text>
  <text x="80" y="588" fill="rgba(255,255,255,0.72)" font-family="JetBrains Mono,monospace" font-size="28">${safeSubtitle}</text>
  <text x="80" y="648" fill="rgba(255,255,255,0.46)" font-family="JetBrains Mono,monospace" font-size="20">IP Protection secure asset seed</text>
</svg>`;
}

export function formatBrandPath(label: string) {
  return normalizeSafeFileName(label || BRAND_NAME);
}
