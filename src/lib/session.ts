export type UserRole = "admin" | "viewer";

export interface SessionUser {
  username: string;
  role: UserRole;
  issuedAt: number;
  expiresAt: number;
}

export interface AuthPayload {
  username: string;
  role: UserRole;
}

export const SESSION_STORAGE_KEY = "ip-protection-session";
export const SESSION_COOKIE_NAME = "ip_protection_session";

export function isSessionUser(value: unknown): value is SessionUser {
  if (value == null || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.username === "string" &&
    (candidate.role === "admin" || candidate.role === "viewer") &&
    typeof candidate.issuedAt === "number" &&
    typeof candidate.expiresAt === "number"
  );
}

