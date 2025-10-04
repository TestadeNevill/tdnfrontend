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
- (Optional) Env var: `VITE_FORMSPREE_ID=<your_form_id>`

## Blog content
- Edit `src/data/blogPosts.js` to control the list.
- Add/remove pages under `src/pages/blog/*` and route in `src/App.jsx` if adding new slugs.
- Images go in `public/assets/*`. If an image is missing, a placeholder will be used automatically.

## Styles
- Blog pages follow your preferred wrapper:
  `min-h-screen bg-white px-4 md:px-10 pt-4 pb-20 max-w-5xl mx-auto text-gray-800 text-lg leading-relaxed space-y-12`
