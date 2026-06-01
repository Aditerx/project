import { createMiddleware } from "@tanstack/react-start";

import { BRAND_NAME } from "./brand";
import { clearSessionCookie, getSessionFromRequest, loginWithPassword } from "./auth.server";
import { ensureStorageLayout, resolveStoragePath } from "./storage.server";
import {
  createVideoFromUploadedAssets,
  createVideoFromForm,
  deleteVideoById,
  getVaultStats,
  listVideos,
  updateVideoFromUploadedAssets,
  updateVideoFromForm,
  validateUploadCandidate,
} from "./media.server";
import { createBunnyUploadTarget } from "./bunny.server";

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
  return (
    pathname === "/vault" ||
    pathname === "/dashboard" ||
    pathname.startsWith("/vault/") ||
    pathname.startsWith("/dashboard/")
  );
}

function isHiddenRoute(pathname: string) {
  return pathname === "/login" || isProtectedPath(pathname);
}

function isAdminOnlyPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
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

type UploadCandidate = {
  name?: string;
  type?: string;
  size?: number;
};

async function handleUploadTargetsRequest(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return jsonResponse({ ok: false, error: "Authentication required." }, { status: 401 });
  }
  if (session.role !== "admin") {
    return jsonResponse({ ok: false, error: "Admin access required." }, { status: 403 });
  }

  const body = (await request.json()) as {
    title?: string;
    video?: UploadCandidate | null;
    thumbnail?: UploadCandidate | null;
  };
  const title = typeof body.title === "string" ? body.title : "asset";
  const targets: Record<string, ReturnType<typeof createBunnyUploadTarget>> = {};

  if (body.video) {
    validateUploadCandidate({
      kind: "video",
      fileName: body.video.name ?? "",
      mimeType: body.video.type ?? "",
      bytes: body.video.size ?? 0,
    });
    targets.video = createBunnyUploadTarget({
      fileName: body.video.name ?? "video.mp4",
      fileType: body.video.type ?? "application/octet-stream",
      kind: "video",
      hint: title,
    });
  }

  if (body.thumbnail) {
    validateUploadCandidate({
      kind: "thumbnail",
      fileName: body.thumbnail.name ?? "",
      mimeType: body.thumbnail.type ?? "",
      bytes: body.thumbnail.size ?? 0,
    });
    targets.thumbnail = createBunnyUploadTarget({
      fileName: body.thumbnail.name ?? "thumbnail.png",
      fileType: body.thumbnail.type ?? "application/octet-stream",
      kind: "thumbnail",
      hint: title,
    });
  }

  return jsonResponse({ ok: true, targets });
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
    const uploadMode = formData.get("uploadMode");
    const video =
      uploadMode === "direct-bunny"
        ? await createVideoFromUploadedAssets(formData)
        : await createVideoFromForm(formData);
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
    const uploadMode = formData.get("uploadMode");
    const video =
      uploadMode === "direct-bunny"
        ? await updateVideoFromUploadedAssets(id, formData)
        : await updateVideoFromForm(id, formData);
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

    if (pathname === "/api/auth/login" && request.method === "POST") {
      return handleAuthLogin(request);
    }

    if (pathname === "/api/auth/logout" && request.method === "POST") {
      return handleAuthLogout();
    }

    if (pathname === "/api/auth/session" && request.method === "GET") {
      return handleAuthSession(request);
    }

    if (pathname === "/api/media/upload-targets" && request.method === "POST") {
      return handleUploadTargetsRequest(request);
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
