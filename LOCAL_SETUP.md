# Local Setup

## Install

```bash
bun install
```

The project now depends on:

- `bcryptjs`
- `plyr`

## Run locally

```bash
bun run dev
```

## Seeded users

The repo ships with two local users in `storage/users/users.json`:

- `admin`
- `viewer`

Seeded local credentials:

- `admin` / `Admin@123!`
- `viewer` / `Viewer@123!`

Use the passwords documented in the source comments and setup notes.

## Storage layout

The app expects these folders:

- `storage/users`
- `storage/metadata`
- `storage/videos`
- `storage/thumbnails`

The middleware will create the folder tree if it is missing, but the committed
seed files make the first run predictable.

## Upload testing

1. Sign in as `admin`
1. Open `/dashboard`
1. Create a record with:
   - title
   - description
   - category
   - tags
   - MP4 or WebM file
   - JPG, PNG, WebP, or SVG thumbnail
1. Save the asset
1. Open `/vault` and verify playback and download

## Troubleshooting

- If login fails, confirm the bcrypt hashes in `storage/users/users.json`
- If videos 404, confirm the files exist under `storage/videos`
- If thumbnails 404, confirm the SVG or image exists under `storage/thumbnails`
- If a hidden route redirects unexpectedly, check the session cookie and the
  sessionStorage entry in the browser tab
- If build errors mention route generation, rerun the dev server so TanStack
  Start regenerates the route tree
