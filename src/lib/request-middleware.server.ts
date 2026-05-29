import { createMiddleware } from "@tanstack/react-start";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";

import { BRAND_NAME } from "./brand";
import {
  clearSessionCookie,
  createSessionCookie,
  getSessionFromRequest,
  loginWithPassword,
  verifySessionToken,
} from "./auth.server";
import {
  ensureStorageLayout,
  resolveStoragePath,
} from "./storage.server";
import {
  createVideoFromForm,
  deleteVideoById,
  getVaultStats,
  listVideos,
  updateVideoFromForm,
} from "./media.server";
import { SESSION_COOKIE_NAME } from "./session";

function jsonResponse(payload: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init?.headers ?? {}),
    },
    ...init,
  });
}

function redirectResponse(request: Request, location: string) {
  return Response.redirect(new URL(location, request.url), 302);
}

function isProtectedPath(pathname: string) {
  return pathname === "/vault" || pathname === "/dashboard" || pathname.startsWith("/vault/") || pathname.startsWith("/dashboard/");
}

function isHiddenRoute(pathname: string) {
  return pathname === "/login" || isProtectedPath(pathname);
}

function isAdminOnlyPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

function mimeTypeForPath(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".json":
      return "application/json; charset=utf-8";
    case ".txt":
      return "text/plain; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

async function serveStorageFile(request: Request, pathname: string) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const relativePath = pathname.replace(/^\/storage\//, "");
  if (!relativePath) return new Response("Not Found", { status: 404 });

  const firstSegment = relativePath.split("/")[0];
  if (firstSegment === "users" || firstSegment === "metadata") {
    return new Response("Not Found", { status: 404 });
  }

  const absolutePath = resolveStoragePath(relativePath);
  try {
    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile()) return new Response("Not Found", { status: 404 });

    const fileBytes = await readFile(absolutePath);
    const headers = new Headers({
      "content-type": mimeTypeForPath(absolutePath),
      "content-length": `${fileBytes.byteLength}`,
      "accept-ranges": "bytes",
      "cache-control": "public, max-age=300",
    });

    const rangeHeader = request.headers.get("range");
    if (rangeHeader && rangeHeader.startsWith("bytes=")) {
      const [startStr, endStr] = rangeHeader.replace("bytes=", "").split("-");
      const start = startStr ? Number(startStr) : 0;
      const end = endStr ? Number(endStr) : fileBytes.byteLength - 1;

      if (Number.isNaN(start) || Number.isNaN(end) || start > end || end >= fileBytes.byteLength) {
        return new Response("Requested Range Not Satisfiable", {
          status: 416,
          headers: { "content-range": `bytes */${fileBytes.byteLength}` },
        });
      }

      const slice = fileBytes.slice(start, end + 1);
      headers.set("content-range", `bytes ${start}-${end}/${fileBytes.byteLength}`);
      headers.set("content-length", `${slice.byteLength}`);
      return new Response(slice, { status: 206, headers });
    }

    if (request.method === "HEAD") {
      return new Response(null, { status: 200, headers });
    }

    return new Response(fileBytes, { status: 200, headers });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}

async function handleAuthLogin(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let username = "";
  let password = "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { username?: string; password?: string };
    username = body.username ?? "";
    password = body.password ?? "";
  } else {
    const formData = await request.formData();
    username = typeof formData.get("username") === "string" ? formData.get("username")! : "";
    password = typeof formData.get("password") === "string" ? formData.get("password")! : "";
  }

  const login = await loginWithPassword(username, password);
  if (!login) {
    return jsonResponse({ ok: false, error: "Invalid credentials." }, { status: 401 });
  }

  return jsonResponse(
    {
      ok: true,
      user: login.user,
      session: login.session,
      redirectTo: login.user.role === "admin" ? "/dashboard" : "/vault",
    },
    {
      headers: {
        "set-cookie": login.cookie,
      },
    },
  );
}

async function handleAuthLogout() {
  return jsonResponse(
    { ok: true },
    {
      headers: {
        "set-cookie": clearSessionCookie(),
      },
    },
  );
}

async function handleAuthSession(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) return jsonResponse({ ok: false, session: null }, { status: 401 });
  return jsonResponse({ ok: true, session });
}

async function handleMediaRequest(request: Request, pathname: string) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return jsonResponse({ ok: false, error: "Authentication required." }, { status: 401 });
  }

  const method = request.method.toUpperCase();
  const parts = pathname.split("/").filter(Boolean);
  const id = parts[2];

  if (method === "GET") {
    const videos = await listVideos();
    const stats = await getVaultStats();
    return jsonResponse({ ok: true, videos, stats });
  }

  if (method === "POST") {
    if (session.role !== "admin") {
      return jsonResponse({ ok: false, error: "Admin access required." }, { status: 403 });
    }
    const formData = await request.formData();
    const video = await createVideoFromForm(formData);
    return jsonResponse({ ok: true, video }, { status: 201 });
  }

  if (!id) {
    return jsonResponse({ ok: false, error: "Video id is required." }, { status: 400 });
  }

  if (method === "PUT" || method === "PATCH") {
    if (session.role !== "admin") {
      return jsonResponse({ ok: false, error: "Admin access required." }, { status: 403 });
    }
    const formData = await request.formData();
    const video = await updateVideoFromForm(id, formData);
    return jsonResponse({ ok: true, video });
  }

  if (method === "DELETE") {
    if (session.role !== "admin") {
      return jsonResponse({ ok: false, error: "Admin access required." }, { status: 403 });
    }
    const video = await deleteVideoById(id);
    return jsonResponse({ ok: true, video });
  }

  return jsonResponse({ ok: false, error: `Unsupported method: ${method}` }, { status: 405 });
}

export const requestMiddleware = createMiddleware({ type: "request" }).server(
  async ({ request, pathname, next }) => {
    await ensureStorageLayout();

    // Public binary asset delivery is owned by the middleware so the app can
    // keep its dev storage structure in a single place without exposing private
    // JSON files or depending on a separate static asset server.
    if (pathname.startsWith("/storage/")) {
      return serveStorageFile(request, pathname);
    }

    if (pathname === "/api/auth/login" && request.method === "POST") {
      return handleAuthLogin(request);
    }

    if (pathname === "/api/auth/logout" && request.method === "POST") {
      return handleAuthLogout();
    }

    if (pathname === "/api/auth/session" && request.method === "GET") {
      return handleAuthSession(request);
    }

    if (pathname === "/api/media" || pathname.startsWith("/api/media/")) {
      return handleMediaRequest(request, pathname);
    }

    // Hidden routes are protected at the request boundary so direct URL access
    // gets redirected before the page shell can render meaningful content.
    if (isProtectedPath(pathname)) {
      const session = getSessionFromRequest(request);
      if (!session) {
        return redirectResponse(request, `/login?next=${encodeURIComponent(pathname)}`);
      }

      if (isAdminOnlyPath(pathname) && session.role !== "admin") {
        return redirectResponse(request, "/vault?error=role");
      }
    }

    const response = await next();

    if (isHiddenRoute(pathname)) {
      response.response.headers.set("x-robots-tag", "noindex, nofollow");
      response.response.headers.set("cache-control", "no-store");
      response.response.headers.set("x-brand", BRAND_NAME);
    }

    return response;
  },
);
