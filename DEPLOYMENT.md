# Self-Hosting Deployment Guide

This project ships with **two build targets**:

| Target | Config | Output | Use for |
|---|---|---|---|
| Cloudflare Workers (default) | `vite.config.ts` | `dist/` + Workers bundle | Lovable hosting (Publish button) |
| Node SSR | `vite.config.node.ts` | `.output/server/index.mjs` | VPS / Render / Docker |

The Lovable preview and the Publish flow are unaffected — they continue to use `npm run build`.

---

## 1. Environment variables

Create a `.env` (or set them in your host's dashboard). The same vars Lovable Cloud injects:

```
# Public (bundled into the client)
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
VITE_SUPABASE_PROJECT_ID=YOUR-PROJECT

# Server-only (never prefixed with VITE_)
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # bypasses RLS — server only
LOVABLE_API_KEY=...                        # only if you use Lovable AI Gateway

# Node runtime
PORT=3000
NODE_ENV=production
```

Get the Supabase keys from your Supabase project → Settings → API.

---

## 2. Build & run locally

```bash
npm install
npm run build:node
npm run start:node          # → http://localhost:3000
```

Output lives at `.output/` (standalone — copy this folder to any Node 20+ host and `node .output/server/index.mjs`).

---

## 3. Render

1. New → Web Service → connect this repo.
2. **Build command:** `npm install && npm run build:node`
3. **Start command:** `node .output/server/index.mjs`
4. **Environment:** Node, add all vars from section 1. Render sets `PORT` automatically.
5. Deploy. Routing, SSR, and Supabase auth/realtime all work out of the box (no SPA rewrites needed — Node SSR handles every path).

---

## 4. VPS (Ubuntu + PM2)

```bash
# On the server
git clone <your-repo> && cd <your-repo>
npm ci
npm run build:node

# Run under PM2
npm i -g pm2
PORT=3000 pm2 start .output/server/index.mjs --name app
pm2 save && pm2 startup
```

Front with Nginx (terminate TLS, proxy to `127.0.0.1:3000`):

```nginx
server {
  listen 443 ssl http2;
  server_name yourdomain.com;
  # ssl_certificate ... ssl_certificate_key ...;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

---

## 5. Docker (optional)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:node

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/.output ./.output
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

```bash
docker build -t myapp .
docker run -p 3000:3000 --env-file .env myapp
```

---

## 6. Notes & gotchas

- **Routing:** Node SSR serves every route from the same process — no `_redirects` / `vercel.json` / SPA fallback needed.
- **Supabase auth & realtime:** work unchanged; they connect directly to Supabase from the browser (publishable key) and from server functions (`requireSupabaseAuth` middleware reads the bearer token).
- **Server functions:** all `createServerFn(...)` calls work identically on Node — same RPC contract, same auth middleware.
- **The Cloudflare config stays:** `vite.config.ts` and `wrangler.jsonc` remain so Lovable preview + Publish keep working. You can deploy to both targets from the same repo.
- **Node 20+ required.**
- **Don't commit `.env`.** Add it to `.gitignore` if not already.
