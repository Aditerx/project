# IP Protection Architecture

## Current Runtime

This project is a TanStack Start application deployed to Vercel.

Build and deployment are driven by:

- `bun install`
- `bun run build`
- Vite 7
- TanStack Start Vite plugin
- Nitro Vercel output in `.vercel/output`

Vercel should deploy the generated `.vercel/output` build output. The app is
not a Next.js app and is not a React Router SPA.

## Routing

Routes are file-based TanStack routes under `src/routes`.

Public routes:

- `/`
- `/about`
- `/solutions`
- `/industries`
- `/insights`
- `/contact`

Hidden routes:

- `/login`
- `/vault`
- `/dashboard`

The generated route tree is `src/routeTree.gen.ts`.

## Server Entry And Middleware

The custom server entry is `src/server.ts`.

`src/start.ts` registers request middleware. Server-only request middleware is
loaded dynamically from `src/lib/request-middleware.server.ts` so the client
build does not import `.server.ts` modules.

The request middleware handles:

- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/session`
- `/api/media`
- `/api/media/:id`
- hidden-route redirects for `/vault` and `/dashboard`
- noindex and no-store headers for hidden routes

## Authentication

Authentication currently uses:

- users stored in `storage/users/users.json`
- server-side password verification with `bcryptjs`
- signed session cookies for request protection
- browser `sessionStorage` as the tab-scoped UI session copy

The sessionStorage behavior is part of the current UI flow. It is not the
deployment architecture.

## Media Storage

New media uploads use Bunny through `bunnyStorageProvider` in
`src/lib/bunny.server.ts`.

Active upload paths:

- `createVideoFromForm`
- `updateVideoFromForm`
- `bunnyStorageProvider.upload(...)`

The app still stores media metadata locally in:

- `storage/metadata/videos.json`

Seed data and some legacy local cleanup helpers still exist in
`src/lib/media.server.ts`, but new uploads are sent to Bunny, not to local disk.

## Bunny Configuration

Bunny storage is configured through environment variables consumed by
`src/lib/bunny.server.ts`.

Expected runtime values include:

- Bunny storage zone
- Bunny access key
- Bunny CDN or storage host configuration

Uploaded media records store the Bunny URL in the media catalog and the vault
plays/downloads from that URL.

## Vercel Deployment

`vite.config.ts` configures:

- `tanstackStart({ server: { entry: "./src/server.ts" } })`
- `nitro({ preset: "vercel" })`
- React plugin support
- tsconfig path aliases

`vercel.json` only defines install/build commands and framework mode. It does
not override `outputDirectory`, because Nitro generates the Vercel Build Output
API directory at `.vercel/output`.

Generated output includes:

- `.vercel/output/config.json`
- `.vercel/output/static`
- `.vercel/output/functions/__server.func/index.mjs`

The Vercel route config sends unmatched requests to the generated server
function, which allows `/` and all TanStack routes to SSR instead of returning
Vercel-level 404s.

## Obsolete Pieces Still Present

These are present in code or docs but are not the active upload architecture:

- `LocalStorageProvider`
- commented local upload calls
- old `/storage/*` seed URLs
- local file streaming helpers
- migration notes that describe a future Bunny migration

Do not treat those as the current deployment target. Bunny upload is already the
active path for new media.
