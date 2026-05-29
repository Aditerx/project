# IP Protection Main Project Documentation

## Overview

IP Protection is an internal media intelligence platform layered onto the existing
TanStack Start application. The public site remains the enterprise-facing
marketing shell, while the hidden routes implement a secure media vault and an
admin media distribution console.

The implementation preserves the existing visual system:

- dark enterprise surfaces
- orange glow accents
- glassmorphism panels
- motion-based reveals
- responsive layouts already present in the codebase

## Architecture

The project is still a TanStack Start application, not a Next.js App Router app.
That distinction matters because routing, middleware, and SSR are handled through
TanStack Start primitives.

Key layers:

1. Public marketing routes
1. Hidden secure routes
1. Request middleware
1. Server-only auth and storage helpers
1. Client-side sessionStorage state

## Route Structure

Public:

- `/`
- `/about`
- `/solutions`
- `/industries`
- `/insights`
- `/contact`

Hidden:

- `/login`
- `/vault`
- `/dashboard`

Hidden routes are:

- excluded from the public nav and footer
- marked `noindex, nofollow`
- protected at the request boundary by middleware
- rendered without the public header/footer shell

## Auth Flow

### Login

1. User submits username and password on `/login`
1. The client sends credentials to `/api/auth/login`
1. The server validates the password with `bcryptjs`
1. The server creates a signed session cookie
1. The client stores the same session object in `sessionStorage`
1. The client redirects to `/vault` or `/dashboard`

### Session persistence

- Refresh: session persists because `sessionStorage` survives page refresh in the same tab
- Close tab/browser: `sessionStorage` clears, so the UI auto-logs out
- Middleware still has a signed cookie for server-side route protection

### Roles

- `viewer`: access to `/vault`
- `admin`: access to `/vault` and `/dashboard`

## Middleware Logic

The request middleware owns three concerns:

1. Static asset delivery from `/storage/*`
1. API handling for `/api/auth/*` and `/api/media/*`
1. Route protection for hidden pages

Protection rules:

- Unauthenticated request to `/vault` or `/dashboard` -> redirect to `/login`
- Viewer request to `/dashboard` -> redirect to `/vault`
- Hidden routes get `X-Robots-Tag: noindex, nofollow`

## Storage Flow

Local filesystem structure:

- `storage/users/users.json`
- `storage/metadata/videos.json`
- `storage/videos/`
- `storage/thumbnails/`

The app uses a middleware-backed storage delivery layer so public media assets
can be accessed via `/storage/videos/...` and `/storage/thumbnails/...` without
exposing sensitive JSON files.

Sensitive files are blocked:

- `storage/users/*`
- `storage/metadata/*`

## Provider Abstraction

The current implementation uses a `LocalStorageProvider`, but the code is
structured around the following interface:

```ts
interface StorageProvider {
  upload()
  delete()
  getUrl()
}
```

That means Bunny.net, Cloudflare R2, AWS S3, Backblaze B2, and Wasabi can be
added later without rewriting the dashboard or vault UI.

## Upload Flow

Admin uploads are multipart form submissions.

Validation rules:

- Videos: MP4 or WebM
- Thumbnails: JPG, PNG, WebP, or SVG
- MIME type and extension both validated
- Size limits enforced for videos and thumbnails

Storage behavior:

- video file uploaded first
- thumbnail uploaded second
- metadata written to `storage/metadata/videos.json`
- old local files removed on replace and delete

## UI Notes

### Login

- enterprise secure access aesthetic
- subtle glass panels
- orange accent styling
- loading and error states

### Vault

- search
- categories
- tags
- featured assets
- recently added assets
- continue watching state stored in sessionStorage
- Plyr-based playback
- download support

### Dashboard

- admin-only CRUD
- create/update/delete
- file replacement
- local media management

## Cloud Migration Strategy

The storage abstraction is already aligned with future cloud providers:

- Bunny.net Storage + CDN
- Cloudflare R2
- AWS S3
- Backblaze B2
- Wasabi

Migration strategy:

1. Keep the metadata schema stable
1. Swap `LocalStorageProvider` for a cloud-backed provider
1. Generate signed URLs from the provider
1. Update CDN URLs where needed
1. Leave the vault and dashboard UI untouched

## Maintenance Recommendations

- Keep all auth logic server-side
- Keep sessionStorage as the browser UX layer only
- Never expose `storage/users` or `storage/metadata` publicly
- Add new media providers behind the provider interface
- Keep new public pages out of hidden route metadata and sitemap
- Reuse the existing design tokens and motion patterns for future screens

