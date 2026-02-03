// import {rspackPlugin} from './rspack.ts'
import type {BuildToolPlugin} from './types.ts'
import {vitePlugin} from './vite.ts'

/**
 * Registry of available build tool plugins.
 */
export const buildToolPlugins: Record<string, BuildToolPlugin> = {
  vite: vitePlugin,
  // rspack: rspackPlugin,
}

/**
 * Gets a build tool plugin by name.
 * @param name build tool name
 * @returns build tool plugin or undefined if not found
 */
export function getBuildToolPlugin(name: string): BuildToolPlugin | undefined {
  return buildToolPlugins[name]
}

/**
 * Gets all available build tool plugin names.
 * @returns array of build tool names
 */
export function getAvailableBuildTools(): string[] {
  return Object.keys(buildToolPlugins)
}

export type {BuildToolPlugin}
// export {rspackPlugin} from './rspack.ts'
export {vitePlugin} from './vite.ts'
