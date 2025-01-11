import adapter from '@hono/vite-dev-server/cloudflare'
import honox from 'honox/vite'
import { defineConfig } from 'vite'
import ssg from '@hono/vite-ssg'
import client from 'honox/vite/client'

export default defineConfig(({mode}) => {
  if (mode === "client") {
    return {
      base: "/sandbox-honox-base-path/",
      build: {
        ssrManifest: true,
      },
      plugins: [client()]
    }
  }

  return {
    base: "/sandbox-honox-base-path/",
    build: {
      emptyOutDir: false,
    },
    plugins: [honox({ devServer: { adapter } }), ssg({entry: "./app/server.ts"})],
    // maybe Vite does not support solution style tsconfig.json yet
    esbuild: {
      jsx: "automatic",
      jsxImportSource: "hono/jsx",
    }
  }
})
