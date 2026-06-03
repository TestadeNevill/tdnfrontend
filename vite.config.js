import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleLabsApi } from './api/dev-server.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [
      react(),
      {
        name: 'labs-api-dev',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (!req.url?.startsWith('/api/labs')) return next()
            const handled = await handleLabsApi(req, res, new URL(req.url, 'http://localhost'))
            if (handled) return
            next()
          })
        },
      },
    ],
  }
})