/* eslint-disable no-console */

import {writeFileSync} from 'fs'
import {join} from 'path'
import type {BundleInfo} from './tool.ts'

/**
 * Exports bundle size results to JSON format.
 * @param allResults bundle info results
 * @param apps list of app names
 * @param variants list of variant names
 * @param activeBuildTools list of active build tools
 * @param statsDir directory to save JSON file
 */
export function exportToJSON(
  allResults: BundleInfo[],
  apps: readonly string[],
  variants: readonly string[],
  activeBuildTools: readonly string[],
  statsDir: string
): void {
  if (allResults.length === 0) {
    return
  }

  const jsonReport = {
    generatedAt: new Date().toISOString(),
    buildTools: activeBuildTools,
    apps,
    variants,
    results: allResults,
  }

  const jsonPath = join(statsDir, 'bundle-sizes-report.json')
  writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2), 'utf-8')
  console.log(`📄 JSON report exported to: ${jsonPath}`)
}
