/* eslint-disable import/no-nodejs-modules */
import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import type {Plugin} from 'vite'

/** Opt-in placeholder for app index.html: `<meta name="app-version" content="__APP_VERSION__"/>` */
const APP_VERSION_PLACEHOLDER = '__APP_VERSION__'

function readLernaVersion(repoRoot: string): string {
  const lernaPath = join(repoRoot, 'lerna.json')
  const parsed = JSON.parse(readFileSync(lernaPath, 'utf8')) as {version?: string}
  if (!parsed.version) {
    throw new Error(`Missing version in ${lernaPath}`)
  }
  return parsed.version
}

/**
 * Replaces {@link APP_VERSION_PLACEHOLDER} in index.html with lerna.json version at build time.
 * Apps opt in by adding `<meta name="app-version" content="__APP_VERSION__"/>` to their index.html.
 * @param rootDir project root dir.
 * @returns vite plugin.
 */
export function appVersionMetaPlugin(rootDir: string): Plugin {
  const version = readLernaVersion(rootDir)
  return {
    name: 'app-version-meta',
    transformIndexHtml(html) {
      if (!html.includes(APP_VERSION_PLACEHOLDER)) {
        return html
      }
      return html.replaceAll(APP_VERSION_PLACEHOLDER, version)
    },
  }
}
