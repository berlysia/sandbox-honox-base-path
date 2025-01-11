import adapter from '@hono/vite-dev-server/cloudflare'
import honox from 'honox/vite'
import { defineConfig, type UserConfig } from 'vite'
import ssg from '@hono/vite-ssg'
import client from 'honox/vite/client'

export default defineConfig(({mode}) => {
  const common: UserConfig = {
    base: "/sandbox-honox-base-path/",
    // maybe Vite does not support solution style tsconfig.json yet
    esbuild: {
      jsx: "automatic",
      jsxImportSource: "hono/jsx",
    }
  };

  if (mode === "client") {
    return {
      ...common,
      build: {
        ssrManifest: true,
      },
      plugins: [client()]
    }
  }

  return {
    ...common,
    build: {
      emptyOutDir: false,
    },
    plugins: [honox({ devServer: { adapter } }), ssg({entry: "./app/server.ts"})],
  }
})
