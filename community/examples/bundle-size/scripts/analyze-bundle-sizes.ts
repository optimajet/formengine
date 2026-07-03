#!/usr/bin/env node

import {execSync} from 'node:child_process'
import {cpSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {getAvailableBuildTools, getBuildToolPlugin} from './build-tools/index.ts'
import {apps, getVariantsForApp, variants} from './report-common.ts'
import {displayBundleSizes} from './report-console.ts'
import {exportToCSV} from './report-csv.ts'
import {exportToHTML} from './report-html.ts'
import {exportToJSON} from './report-json.ts'
import {exportToMarkdown} from './report-mdx.ts'
import {type BundleInfo, getBundleInfo} from './tool.ts'
import {getActualFileSize} from './utils.ts'

export interface BundleChunk {
  filename?: string
  label?: string
  size?: number
  parsedSize?: number
  statSize?: number
  actualSize?: number
  groups?: BundleChunk[]
  source?: BundleChunk[]
  stats?: BundleChunk[]
}

export type BundleStats =
  | {
      chunks?: Record<string, BundleChunk>
      modules?: BundleChunk[]
      size?: number
    }
  | BundleChunk[]
  | undefined

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const statsDir = join(rootDir, '.bundle-stats')

const activeBuildTools = getAvailableBuildTools()

function buildApp(appName: string, variant: string, tool: string): boolean {
  const appPath = join(rootDir, appName)

  if (!existsSync(appPath)) {
    console.warn(`App directory not found: ${appName}`)
    return false
  }

  const plugin = getBuildToolPlugin(tool)
  if (!plugin) {
    console.error(`❌ Build tool plugin not found: ${tool}`)
    return false
  }

  try {
    console.log(`🔨 Building ${appName} with variant: ${variant} using ${tool}...`)

    const buildCommand = plugin.getBuildCommand(appPath, variant)
    const statsFileName = plugin.getStatsFileName(variant)

    try {
      execSync(buildCommand, {
        cwd: appPath,
        env: {
          ...process.env,
          APP_INPUT: variant,
        },
        stdio: 'inherit',
      })
    } catch (error) {
      const distPath = join(rootDir, appName, 'dist')
      const shouldIgnore = plugin.handleBuildError(error, appPath, variant, distPath)
      if (!shouldIgnore) {
        throw error
      }
    }

    // Copy build output and stats to central location before next build overwrites it
    const distPath = join(rootDir, appName, 'dist')
    const distStatPath = join(distPath, statsFileName)

    if (existsSync(distPath)) {
      if (!existsSync(statsDir)) {
        mkdirSync(statsDir, {recursive: true})
      }

      // Create folder for this build variant: {appName}-{variant}-{tool}
      const buildOutputDir = join(statsDir, `${appName}-${variant}-${tool}`)

      // Remove existing build output if it exists
      if (existsSync(buildOutputDir)) {
        execSync(`rm -rf "${buildOutputDir}"`, {cwd: rootDir})
      }

      // Read stats and update with actual file sizes from original dist before copying
      if (existsSync(distStatPath)) {
        const statsContent = readFileSync(distStatPath, 'utf-8')
        let parsedStats: BundleStats = JSON.parse(statsContent)

        if (parsedStats) {
          // Process stats through plugin if needed
          if (plugin.processStats) {
            parsedStats = plugin.processStats(parsedStats, distPath, variant) as BundleStats
          }

          const stats = parsedStats

          // Update stats with actual file sizes from the original dist folder
          if (Array.isArray(stats)) {
            for (const module of stats) {
              if (module.filename) {
                module.actualSize = getActualFileSize(distPath, module.filename)
              }
            }
          } else if (stats && 'chunks' in stats && stats.chunks) {
            for (const chunk of Object.values(stats.chunks)) {
              if (chunk?.filename) {
                chunk.actualSize = getActualFileSize(distPath, chunk.filename)
              }
            }
          } else if (stats && stats.modules && Array.isArray(stats.modules)) {
            for (const module of stats.modules) {
              if (module.filename) {
                module.actualSize = getActualFileSize(distPath, module.filename)
              }
            }
          }

          // Copy entire dist folder to build output directory
          cpSync(distPath, buildOutputDir, {recursive: true})

          // Save updated stats with actual sizes in the build output directory
          const savedStatPath = join(buildOutputDir, statsFileName)
          writeFileSync(savedStatPath, JSON.stringify(stats, null, 2), 'utf-8')

          // Also save a copy in the root stats dir for easy access
          const rootStatPath = join(statsDir, `${appName}-${variant}-${tool}.json`)
          writeFileSync(rootStatPath, JSON.stringify(stats, null, 2), 'utf-8')
        }
      } else {
        // If no stats file, still copy the build output
        cpSync(distPath, buildOutputDir, {recursive: true})
      }
    }

    return true
  } catch (error) {
    console.error(`❌ Failed to build ${appName} with variant ${variant} using ${tool}:`, (error as Error).message)
    return false
  }
}

async function main(): Promise<void> {
  // Build all variants for all apps with all active build tools
  console.log(`\n🔨 Building all variants using ${activeBuildTools.map(t => t.toUpperCase()).join(' and ')}...\n`)
  for (const tool of activeBuildTools) {
    console.log(`\n📦 Building with ${tool.toUpperCase()}...\n`)
    for (const app of apps) {
      const appVariants = getVariantsForApp(app)
      for (const variant of appVariants) {
        if (!buildApp(app, variant, tool)) {
          console.error(`Build of ${app}-${variant} using ${tool} FAILED`)
          process.exit(1)
        }
      }
    }
  }

  console.log('\n📊 Collecting bundle statistics...\n')

  // Collect all bundle info for all apps, variants, and build tools
  const allResults: BundleInfo[] = []
  for (const tool of activeBuildTools) {
    for (const app of apps) {
      const appVariants = getVariantsForApp(app)
      for (const variant of appVariants) {
        const info = await getBundleInfo(app, variant, tool, statsDir)
        if (info) {
          allResults.push(info)
        }
      }
    }
  }

  // Display results
  displayBundleSizes(allResults, apps, variants, activeBuildTools)

  // Export reports
  exportToCSV(allResults, apps, variants, activeBuildTools, statsDir)
  exportToJSON(allResults, apps, variants, activeBuildTools, statsDir)
  exportToHTML(allResults, apps, variants, activeBuildTools, statsDir)
  exportToMarkdown(allResults, apps, variants, activeBuildTools, statsDir)
}

try {
  await main()
} catch (error) {
  console.error('Fatal error:', error)
  process.exitCode = 1
}
