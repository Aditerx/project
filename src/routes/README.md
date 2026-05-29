# Routes

This project uses **TanStack Start file-based routing**. Every `.tsx` file in
`src/routes` maps to a route. The root shell lives in `src/routes/__root.tsx`.

## Conventions

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `about.tsx` | `/about` |
| `solutions.tsx` | `/solutions` |
| `industries.tsx` | `/industries` |
| `insights.tsx` | `/insights` |
| `contact.tsx` | `/contact` |
| `login.tsx` | `/login` |
| `vault.tsx` | `/vault` |
| `dashboard.tsx` | `/dashboard` |
| `__root.tsx` | app shell and shared providers |

## Hidden routes

`/login`, `/vault`, and `/dashboard` are intentionally omitted from the public
navigation and footer. They are protected by request middleware and marked
`noindex, nofollow` in route metadata and response headers.

## Notes

- `routeTree.gen.ts` is generated. Do not edit it by hand.
- Public routes render the shared marketing shell.
- Hidden routes render their own internal experience after the root shell
  suppresses the public header and footer.

