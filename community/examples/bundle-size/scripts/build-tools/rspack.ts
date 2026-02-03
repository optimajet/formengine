import {existsSync} from 'fs'
import {join} from 'path'
import type {BuildToolPlugin} from './types.ts'
import type {BundleStats} from '../analyze-bundle-sizes.ts'

/**
 * Rspack build tool plugin.
 */
export const rspackPlugin: BuildToolPlugin = {
  name: 'rspack',

  getBuildCommand(_appPath: string, _variant: string): string {
    return 'npm run build:rspack'
  },

  getStatsFileName(variant: string): string {
    return `rspack-stat-${variant}.json`
  },

  handleBuildError(_error: unknown, _appPath: string, variant: string, distPath: string): boolean {
    // Rspack may return non-zero exit code even on successful builds
    // Check if the stats file exists to determine if build actually succeeded
    const statsPath = join(distPath, this.getStatsFileName(variant))
    if (existsSync(statsPath)) {
      console.warn(`⚠️  Rspack returned non-zero exit code, but ${this.getStatsFileName(variant)} was generated. Continuing...`)
      return true // Ignore the error
    }
    return false // Don't ignore the error
  },

  processStats(stats: BundleStats, _distPath: string, _variant: string): BundleStats {
    // Rspack stats file is already created by the config plugin
    // No transformation needed
    return stats
  },
}
