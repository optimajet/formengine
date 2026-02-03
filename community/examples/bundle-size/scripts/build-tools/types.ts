import type {BundleStats} from '../analyze-bundle-sizes.ts'

/**
 * Build tool plugin interface.
 * Each build tool (vite, rspack, etc.) implements this interface.
 */
export interface BuildToolPlugin {
  /**
   * Name of the build tool.
   */
  readonly name: string

  /**
   * Build command to execute.
   * @param appPath path to the app directory
   * @param variant build variant (e.g., 'login', 'booking-mui')
   * @returns build command string
   */
  getBuildCommand(appPath: string, variant: string): string

  /**
   * Stats file name for the given variant.
   * @param variant build variant
   * @returns stats file name
   */
  getStatsFileName(variant: string): string

  /**
   * Handles build errors that may be tool-specific.
   * @param error build error
   * @param appPath path to the app directory
   * @param variant build variant
   * @param distPath path to dist directory
   * @returns true if error should be ignored, false otherwise
   */
  handleBuildError(error: unknown, appPath: string, variant: string, distPath: string): boolean

  /**
   * Processes stats file after build if needed.
   * Some tools may need to transform or validate the stats file.
   * @param stats parsed stats object
   * @param distPath path to dist directory
   * @param variant build variant
   * @returns processed stats or original stats if no processing needed
   */
  processStats?(stats: BundleStats, distPath: string, variant: string): BundleStats
}
