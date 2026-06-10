# Testa De Nevill — Frontend Only (Vite + React + Tailwind)

Pages: Home, About, Projects, Blog, Contact. Blog includes routes for two sample posts.

## Run
```bash
npm i
npm run dev
```

## Deploy (Vercel)
- Framework preset: **Vite**
- Build command: `npm run build`
- Output: `dist`

### Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (see also `.env.example`). Use `.env.local` for local dev only; Vercel does not read it.

| Variable | Scope | Required | Notes |
|---|---|---|---|
| `VITE_FORMSPREE_ID` | Production, Preview | For contact form | Must use `VITE_` prefix; redeploy after adding |
| `GOOGLE_PLACES_API_KEY` | Production, Preview | For Nearest Parks Finder | Server-side only — **do not** prefix with `VITE_` |
| `OPENAI_API_KEY` | Production, Preview | Optional | Labs AI demos (server-side only) |

**Google Places setup (parks finder):**

1. In [Google Cloud Console](https://console.cloud.google.com/), enable **Places API (New)** and **Places API** (legacy photo media endpoint).
2. Create an API key restricted to those APIs (optionally restrict by your Vercel production domain or IP).
3. Add `GOOGLE_PLACES_API_KEY` to Vercel for Production (and Preview if you want parks on preview deploys).
4. Redeploy after adding the variable.

Without `GOOGLE_PLACES_API_KEY`, `/api/labs/parks/nearby` returns `502` with a clear error — there is no silent fallback to mock data in production.

### Labs API routes (Vercel serverless)

Configured in `vercel.json` with 15s timeout for parks and map routes, 30s for AI:

- `POST /api/labs/parks/nearby` — Google Places nearby search `{ lat, lng }` (requires `GOOGLE_PLACES_API_KEY`)
- `GET /api/labs/parks/photo?ref=...&maxHeight=80` — proxies park thumbnails (same key; cached 24h)
- `GET /api/labs/health` — reports which integrations are configured (`googlePlaces: true` when key is set)
- `POST /api/labs/ai/complete` — optional OpenAI proxy (requires `OPENAI_API_KEY`)

Local dev: `npm run dev` serves `/api/labs/*` via Vite middleware using the same handlers as production.

### Post-deploy verification

1. `GET https://<your-domain>/api/labs/health` → `services.googlePlaces: true`
2. `/labs` → **Nearest Parks Finder** → **Use my location** → up to 10 parks with image markers
3. Click a marker → modal shows hours, contact, address, and **Get directions**
4. Confirm marker thumbnails load via `/api/labs/parks/photo?ref=...`

## Blog content
- Edit `src/data/blogPosts.js` to control the list.
- Add/remove pages under `src/pages/blog/*` and route in `src/App.jsx` if adding new slugs.
- Images go in `public/assets/*`. If an image is missing, a placeholder will be used automatically.

## Styles
- Blog pages follow your preferred wrapper:
  `min-h-screen bg-white px-4 md:px-10 pt-4 pb-20 max-w-5xl mx-auto text-gray-800 text-lg leading-relaxed space-y-12`
