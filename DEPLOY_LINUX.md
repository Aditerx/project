# Linux Deployment

## Supported baseline

- Ubuntu LTS or Debian stable
- Node.js LTS or Bun
- PM2 for process supervision
- Nginx as the reverse proxy

## Install runtime

```bash
curl -fsSL https://bun.sh/install | bash
```

or install Node.js LTS using your distro package manager or NodeSource.

## Build and run

```bash
bun install
bun run build
pm2 start dist/server/server.js --name ip-protection
pm2 save
```

## Nginx reverse proxy

Example high-level configuration:

- listen on 80 and 443
- redirect HTTP to HTTPS
- proxy `/` to the local SSR server port
- forward `Host`, `X-Forwarded-For`, and `X-Forwarded-Proto`

## SSL setup

- Use Let’s Encrypt where possible
- Renew certificates automatically
- Force HTTPS
- Keep cookies `Secure` in production

## Firewall guidance

- Allow only 80/443 publicly
- Keep the app port bound to localhost
- Restrict SSH to admin IPs if possible

## Production optimization

- Run the process under a non-root user
- Rotate logs
- Back up the `storage` directory
- Keep media uploads on fast local storage if cloud migration has not happened yet
- Use the provider abstraction before introducing Bunny.net or object storage

