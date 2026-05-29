import { useEffect, useState } from "react";

import type { SessionUser } from "@/lib/session";
import { SESSION_STORAGE_KEY } from "@/lib/session";

export function readAuthSession(): SessionUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionUser;
    if (
      typeof parsed?.username !== "string" ||
      (parsed.role !== "admin" && parsed.role !== "viewer") ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt < Date.now()
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function writeAuthSession(session: SessionUser) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

export function useAuthSession() {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // We intentionally wait until mount before reading sessionStorage. This
    // prevents a server/client mismatch and lets hidden routes render a neutral
    // loading shell until the browser confirms who is actually signed in.
    const current = readAuthSession();
    setSession(current);
    setReady(true);
  }, []);

  return {
    session,
    ready,
    setSession: (next: SessionUser | null) => {
      setSession(next);
      if (next) {
        writeAuthSession(next);
      } else {
        clearAuthSession();
      }
    },
    clearSession: () => {
      setSession(null);
      clearAuthSession();
    },
  };
}

