import fs from 'fs'
import path from 'path'
import type { Manifest, UserConfigExport } from 'vite'
import viteConfig from '../vite.config.ts'

const config: UserConfigExport = viteConfig;
const calcuratedConfig = typeof config === "function" ? config({mode: "", command: "build"}) : config;
const resolvedConfig = calcuratedConfig instanceof Promise ? await calcuratedConfig : calcuratedConfig;

const givenBasePath = resolvedConfig.base ?? '/'

const manifestPath = path.resolve(import.meta.dirname, '../dist/.vite/manifest.json')
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as Manifest

// preserve given style
const basePath = givenBasePath.startsWith('/') ? givenBasePath.slice(1, givenBasePath.length) : givenBasePath

Object.keys(manifest).forEach((assetName) => {
  const file = manifest[assetName].file
  manifest[assetName].file = basePath + file
})

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

console.log(`Injected base path ${basePath} into manifest.json`)
