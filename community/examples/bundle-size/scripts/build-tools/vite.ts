import type {BuildToolPlugin} from './types.ts'
import type {BundleStats} from '../analyze-bundle-sizes.ts'

/**
 * Vite build tool plugin.
 */
export const vitePlugin: BuildToolPlugin = {
  name: 'vite',

  getBuildCommand(_appPath: string, _variant: string): string {
    return 'npm run build'
  },

  getStatsFileName(variant: string): string {
    return `vite-stat-${variant}.json`
  },

  handleBuildError(_error: unknown, _appPath: string, _variant: string, _distPath: string): boolean {
    // Vite build errors should not be ignored
    return false
  },

  processStats(stats: BundleStats, _distPath: string, _variant: string): BundleStats {
    // Vite stats don't need special processing
    return stats
  },
}
