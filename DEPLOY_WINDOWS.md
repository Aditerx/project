# Windows Deployment

## Runtime prerequisites

- Windows Server or Windows 11/10 with production hardening
- Node.js LTS or Bun installed
- IIS or Nginx available as a reverse proxy
- TLS certificate installed for HTTPS

## Recommended process manager

Use PM2 to keep the SSR server alive.

Example:

```bash
bun run build
pm2 start dist/server/server.js --name ip-protection
pm2 save
```

## Reverse proxy options

### IIS

- Create a site bound to HTTPS
- Enable the URL Rewrite module
- Proxy requests to the Node/Bun server port
- Preserve `X-Forwarded-Proto` and `X-Forwarded-For`

### Nginx on Windows

- Listen on 80 and 443
- Redirect HTTP to HTTPS
- Proxy `/` to the local SSR server
- Forward upgrade headers if you later add WebSocket features

## SSL guidance

- Prefer a certificate from a trusted CA
- Enable automatic renewal if possible
- Redirect all HTTP traffic to HTTPS
- Set `Secure` on cookies in production

## Production recommendations

- Run the app under a dedicated service account
- Restrict file permissions on `storage/users` and `storage/metadata`
- Back up the storage tree before uploads go live
- Keep the Node/Bun process behind a reverse proxy
- Monitor logs for failed auth attempts and media upload errors

