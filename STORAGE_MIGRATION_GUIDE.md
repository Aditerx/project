# Storage Migration Guide

## Current state

The app uses a provider abstraction so the dashboard and vault do not need to
care where media is physically stored.

Current provider:

- `LocalStorageProvider`

Current local layout:

- `storage/videos`
- `storage/thumbnails`
- `storage/metadata/videos.json`
- `storage/users/users.json`

## Why the abstraction matters

The UI talks to media operations through stable concepts:

- upload
- delete
- getUrl

That means the storage backend can change without rewriting the app screens.

## Bunny.net migration

Bunny is the most natural next step because the app already prepares for:

- Bunny Storage
- Bunny CDN
- signed URLs
- cloud streaming

Suggested migration steps:

1. Implement a `BunnyStorageProvider`
1. Store media in Bunny Storage
1. Generate signed playback URLs
1. Serve thumbnails through Bunny CDN
1. Update the provider config and keep the dashboard UI unchanged

## Cloudflare R2 migration

Cloudflare R2 works well if you want S3-compatible semantics without AWS.

Suggested steps:

1. Implement an `R2StorageProvider`
1. Mirror the local upload and delete contract
1. Generate public or signed URLs through Cloudflare
1. Keep metadata in the same JSON schema until a database migration is needed

## AWS S3 migration

For AWS:

1. Implement an `S3StorageProvider`
1. Map local filenames to S3 object keys
1. Generate signed URLs or use CloudFront
1. Keep the metadata schema stable

## Backblaze B2 and Wasabi

Both are straightforward once the abstraction exists.

The main work is:

- object upload
- object deletion
- URL generation
- signed access if desired

## CDN strategy

Recommended future model:

- store raw assets in object storage
- deliver playback via CDN
- keep thumbnails cached aggressively
- use signed URLs for private video playback

## Scaling recommendations

- keep metadata in a database once the catalog grows
- keep binaries in object storage, not the app server
- retain the provider interface so the dashboard logic stays stable
- keep signed URL generation server-side only
- keep hidden route access controlled by middleware regardless of storage backend

