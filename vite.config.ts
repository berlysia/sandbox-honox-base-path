import adapter from '@hono/vite-dev-server/cloudflare'
import honox from 'honox/vite'
import { defineConfig } from 'vite'
import ssg from '@hono/vite-ssg'

export default defineConfig({
  plugins: [honox({ devServer: { adapter } }), ssg({entry: "./app/server.ts"})]
})
