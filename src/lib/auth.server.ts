import crypto from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

import bcrypt from "bcryptjs";

import { SESSION_COOKIE_NAME, type AuthPayload, type SessionUser, type UserRole } from "./session";
import {
  ensureStorageLayout,
  fileExists,
  STORAGE_USERS_FILE,
  writeJsonFile,
  readJsonFile,
} from "./storage.server";

export interface StoredUser extends AuthPayload {
  passwordHash: string;
}

const SESSION_SECRET =
  process.env.IP_PROTECTION_SESSION_SECRET ?? "ip-protection-dev-session-secret-change-me";

const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

// These seeded hashes are generated with bcryptjs and stored directly so the
// repository never needs plaintext credentials, even in the initial fixture.
const SEEDED_USERS: StoredUser[] = [
  {
    username: "admin",
    passwordHash: "$2b$10$L2smu5RCUzzlUKCn6V4cfOg0oEjvysvPhMtTAA7c0aEZxdrYXad6e",
    role: "admin",
  },
  {
    username: "viewer",
    passwordHash: "$2b$10$bOuQ/1IYUaWrdHK6VPC7J.aa.RtImJr0cvsHKJGSa4XH8wdFpOX5O",
    role: "viewer",
  },
];

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload: string) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
}

export async function ensureUsersSeeded() {
  await ensureStorageLayout();

  if (await fileExists(STORAGE_USERS_FILE)) return;
  await writeJsonFile(STORAGE_USERS_FILE, SEEDED_USERS);
}

export async function readUsers(): Promise<StoredUser[]> {
  await ensureUsersSeeded();
  return readJsonFile(STORAGE_USERS_FILE, SEEDED_USERS);
}

export async function writeUsers(users: StoredUser[]) {
  await ensureUsersSeeded();
  await writeJsonFile(STORAGE_USERS_FILE, users);
}

export async function findUser(username: string) {
  const users = await readUsers();
  return users.find((user) => user.username.toLowerCase() === username.toLowerCase()) ?? null;
}

export async function verifyCredentials(username: string, password: string) {
  const user = await findUser(username);
  if (!user) return null;

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) return null;

  return user;
}

export function buildSessionUser(user: AuthPayload): SessionUser {
  const issuedAt = Date.now();
  return {
    ...user,
    issuedAt,
    expiresAt: issuedAt + SESSION_TTL_MS,
  };
}

export function createSessionToken(session: SessionUser) {
  const payload = base64UrlEncode(JSON.stringify(session));
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | null | undefined) {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = signPayload(payload);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const session = JSON.parse(base64UrlDecode(payload)) as SessionUser;
    if (
      typeof session?.username !== "string" ||
      (session.role !== "admin" && session.role !== "viewer") ||
      typeof session.issuedAt !== "number" ||
      typeof session.expiresAt !== "number"
    ) {
      return null;
    }

    if (session.expiresAt < Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function parseCookieHeader(cookieHeader: string | null | undefined) {
  const cookies = new Map<string, string>();
  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((chunk) => {
    const index = chunk.indexOf("=");
    if (index < 0) return;
    const key = chunk.slice(0, index).trim();
    const value = chunk.slice(index + 1).trim();
    cookies.set(key, decodeURIComponent(value));
  });

  return cookies;
}

export function getSessionFromRequest(request: Request) {
  const cookies = parseCookieHeader(request.headers.get("cookie"));
  return verifySessionToken(cookies.get(SESSION_COOKIE_NAME));
}

export function createSessionCookie(session: SessionUser) {
  const token = createSessionToken(session);
  const secure = process.env.NODE_ENV === "production";

  // We intentionally keep the cookie as a browser session cookie so the
  // browser can drop it on close. The client still mirrors the session in
  // `sessionStorage`, which gives us the required tab-scoped UX on top of the
  // server-readable marker middleware needs for protection.
  return [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === "production";
  return [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export async function loginWithPassword(username: string, password: string) {
  const user = await verifyCredentials(username.trim(), password);
  if (!user) return null;

  const session = buildSessionUser({ username: user.username, role: user.role as UserRole });
  return {
    user: { username: session.username, role: session.role },
    session,
    cookie: createSessionCookie(session),
  };
}

