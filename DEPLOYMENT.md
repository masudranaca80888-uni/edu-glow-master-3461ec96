# EduMaster Pro — Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│  Frontend (cPanel)                          │
│  TanStack Start · React SSR                 │
│  https://yourdomain.com                     │
│  API calls → VITE_API_URL                   │
└────────────────┬────────────────────────────┘
                 │ HTTPS /api/* calls
                 ▼
┌─────────────────────────────────────────────┐
│  Backend (Render.com)                       │
│  Express API · port auto (PORT env)         │
│  https://edumaster-pro-api.onrender.com     │
│  CORS_ORIGIN = frontend domain              │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Supabase (optional)                        │
│  Auth · PostgreSQL · Storage                │
│  Falls back to demo mode if unconfigured    │
└─────────────────────────────────────────────┘
```

---

## Part 1 — Backend on Render

### Step 1: Push repo to GitHub
```bash
git remote add origin https://github.com/your-org/edumaster-pro.git
git push -u origin main
```

### Step 2: Create a Web Service on Render
1. [render.com](https://render.com) → **New → Web Service**
2. Connect the GitHub repo
3. Render will detect `render.yaml` automatically. Confirm these settings:

| Setting | Value |
|---|---|
| Name | `edumaster-pro-api` |
| Region | Singapore (or nearest) |
| Build Command | `npm install && npm run build:backend` |
| Start Command | `npm run start:api` |
| Health Check Path | `/api/health` |

### Step 3: Set Environment Variables in Render dashboard

Go to **Environment** tab and add:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://yourdomain.com` (your cPanel domain) |
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | your anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | your service-role key (**secret, never expose**) |

> Without Supabase vars the backend runs in **demo mode** automatically.

### Step 4: Verify
After deploy (≈ 2–3 min):
```
https://edumaster-pro-api.onrender.com/api/health
```
Expected:
```json
{ "status": "ok", "service": "EduMaster Pro API", "mode": "live" }
```

**Save your Render URL** — you need it for the frontend build.

---

## Part 2 — Frontend on cPanel

### Two Options — choose based on your host:

| | Option A: Node.js App | Option B: Static SPA |
|---|---|---|
| **SSR** | ✅ Full server-side rendering | ❌ Client-side only |
| **Host requirement** | cPanel with Node.js Selector | Any shared hosting (Apache) |
| **Complexity** | Medium | Simple |

---

### Option A — Node.js Passenger (Full SSR)
For hosts with **Node.js Selector** (Hostinger, A2 Hosting, NameCheap Business, etc.)

#### 1. Build locally
```bash
VITE_API_URL=https://edumaster-pro-api.onrender.com \
VITE_SUPABASE_URL=https://xxxx.supabase.co \
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ... \
npm run build:node
```

#### 2. Upload to your server
Upload these to a folder outside `public_html` (e.g. `/home/user/edumaster-app/`):
- `.output/` (entire folder)
- `package.json`

#### 3. Configure cPanel Node.js Selector
1. cPanel → **Software → Node.js**
2. Click **Create Application**:
   - **Node.js version**: `20.x`
   - **Application mode**: `Production`
   - **Application root**: `/home/user/edumaster-app`
   - **Application URL**: your domain
   - **Application startup file**: `.output/server/index.mjs`
3. Click **Create** → **Run NPM Install** → **Restart**

---

### Option B — Static Files on Apache
For standard shared hosting (no Node.js support needed).

#### 1. Build locally
```bash
VITE_API_URL=https://edumaster-pro-api.onrender.com \
VITE_SUPABASE_URL=https://xxxx.supabase.co \
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ... \
npm run build:node
```

#### 2. Upload to cPanel
Upload everything inside `.output/public/` to your `public_html/` directory.

The `.htaccess` file (from `frontend/public/.htaccess`) is included in the build and handles SPA routing on Apache automatically.

> **Note:** In static mode the app is fully client-rendered — SSR is not active.
> All API calls still go to Render over HTTPS.

---

## Part 3 — Supabase Production Setup

### 1. Enable real auth
Set these on **both** frontend build and Render backend:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...anon_key...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...service_role_key...
```

### 2. Whitelist your domain in Supabase
Supabase dashboard → **Authentication → URL Configuration**:
- **Site URL**: `https://yourdomain.com`
- **Redirect URLs**: `https://yourdomain.com/**`

### 3. Apply database migrations
```bash
npx supabase db push --project-ref your-project-id
```

### 4. Verify
Hit `/api/health` — the `supabase_configured` field will be `true` and `mode` will be `"live"`.

---

## Environment Variables Reference

### Frontend (baked into JS at build time — `VITE_` prefix required)

| Variable | Dev | Production | Description |
|---|---|---|---|
| `VITE_API_URL` | *(empty)* | `https://edumaster-pro-api.onrender.com` | Backend base URL. Empty = use Vite proxy |
| `VITE_SUPABASE_URL` | from `.env` | from `.env` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | from `.env` | from `.env` | Supabase anon key (public) |

### Backend (Render environment variables — never exposed to browser)

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | Set to `production` |
| `CORS_ORIGIN` | Yes | Comma-separated allowed origins, e.g. `https://yourdomain.com` |
| `PORT` | Auto | Render sets this — do not override |
| `SUPABASE_URL` | For live mode | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | For live mode | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | For live mode | **Secret** — bypasses RLS |

---

## Demo Mode vs Live Mode

The app works **without any Supabase configuration**. When backend has no Supabase vars:

| | Demo Mode | Live Mode |
|---|---|---|
| **Activation** | No Supabase env vars | Supabase env vars set |
| **Login** | `demo@student.com` / `Demo@1234` | Real Supabase auth |
| **Data** | In-memory, resets on restart | Supabase PostgreSQL |
| **Health endpoint** | `"mode": "demo"` | `"mode": "live"` |

Admin demo: `admin@edumaster.pro` / `Admin@1234`

---

## CI/CD with GitHub Actions (optional)

Auto-build and FTP-deploy frontend on every push to `main`:

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend to cPanel
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm install
      - run: npm run build:node
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
      - name: FTP Deploy
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USER }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: .output/public/
          server-dir: /public_html/
```

Add `VITE_API_URL`, `FTP_SERVER`, `FTP_USER`, `FTP_PASSWORD` as GitHub repository secrets.
Render redeploys the backend automatically on every push.

---

## Build Commands Summary

```bash
# Development
npm run dev           # Frontend dev server (port 5000)
npm run dev:api       # Backend API server (port 3001)

# Production builds
npm run build:backend # Compile backend TS → .output/api/index.js
npm run build:node    # Build frontend SSR → .output/server/ + .output/public/

# Production start
npm run start:api     # Start compiled backend (after build:backend)
npm run start:node    # Start SSR frontend server (after build:node)
```
