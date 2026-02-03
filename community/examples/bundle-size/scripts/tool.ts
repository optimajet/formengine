import {existsSync, readFileSync} from 'fs'
import {join} from 'path'
import type {BundleChunk, BundleStats} from './analyze-bundle-sizes.ts'
import {getCompressedSizes} from './utils.ts'

export interface BundleBreakdown {
  code: number
  css: number
}

export interface DuplicatePackage {
  packageName: string
  occurrences: number
  totalSize: number
  chunks: string[]
  roots: string[]
}

export interface DuplicateStats {
  packages: DuplicatePackage[]
  totalDuplicateSize: number
  duplicateCount: number
}

export interface BundleInfo {
  app: string
  variant: string
  buildTool: string
  totalSize: number
  totalSizeGzip?: number
  chunks: Record<string, BundleChunk>
  breakdown: BundleBreakdown
  breakdownGzip?: BundleBreakdown
  duplicates: DuplicateStats
}

/**
 * Calculates total size from bundle stats.
 * @param stats bundle stats
 * @returns total size in bytes
 */
export function calculateTotalSize(stats: BundleStats): number {
  if (!stats) return 0

  let total = 0

  if (Array.isArray(stats)) {
    for (const module of stats) {
      // Prefer actualSize (actual file size from disk), then fall back to other metrics
      const size = module.actualSize ?? module.size ?? module.parsedSize ?? module.statSize ?? 0
      total += size
    }
  } else if ('chunks' in stats && stats.chunks) {
    for (const chunk of Object.values(stats.chunks)) {
      const size = chunk?.actualSize ?? chunk?.size ?? chunk?.parsedSize ?? chunk?.statSize ?? 0
      total += size
    }
  } else if (stats.modules && Array.isArray(stats.modules)) {
    for (const module of stats.modules) {
      const size = module.actualSize ?? module.size ?? module.parsedSize ?? module.statSize ?? 0
      total += size
    }
  }

  return total
}

/**
 * Calculates percentage safely, avoiding division by zero.
 * @param part part value
 * @param total total value
 * @returns percentage as a number (0-100)
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0
  return (part / total) * 100
}

/**
 * Recursively extracts all modules from bundle stats.
 * @param node stats node (can be chunk or module)
 * @param modules array to collect modules with their paths and sizes
 */
export function extractModulesRecursive(node: BundleChunk | undefined, modules: Array<{path: string; size: number}>): void {
  if (!node) return

  const nodePath = node.filename || node.label || ''
  const nodeSize = node.actualSize ?? node.size ?? node.parsedSize ?? node.statSize ?? 0

  // Check if this node has children (groups, source, or stats)
  const hasChildren =
    (Array.isArray(node.groups) && node.groups.length > 0) ||
    (Array.isArray(node.source) && node.source.length > 0) ||
    (Array.isArray(node.stats) && node.stats.length > 0)

  // Process children first
  if (hasChildren) {
    if (node.groups) {
      for (const child of node.groups) {
        extractModulesRecursive(child, modules)
      }
    }
    if (node.source) {
      for (const child of node.source) {
        extractModulesRecursive(child, modules)
      }
    }
    if (node.stats) {
      for (const child of node.stats) {
        extractModulesRecursive(child, modules)
      }
    }
  }

  // If this is a leaf node (module) with a path and size, add it
  if (nodePath && nodeSize > 0 && !hasChildren) {
    const existingModule = modules.find(m => m.path === nodePath)
    if (existingModule) {
      // If module exists, add to its size
      existingModule.size += nodeSize
    } else {
      modules.push({path: nodePath, size: nodeSize})
    }
  }
}

/**
 * Categorizes a module path into breakdown categories.
 * @param path module file path
 * @returns category: 'own', 'css', or 'external'
 */
export function categorizeModule(path: string): 'own' | 'css' | 'external' {
  const normalizedPath = path.toLowerCase()

  // Check if it's a CSS file
  if (normalizedPath.endsWith('.css')) {
    return 'css'
  }

  // Check if it's from node_modules (external dependency)
  if (normalizedPath.includes('node_modules')) {
    return 'external'
  }

  // Otherwise it's own code
  return 'own'
}

/**
 * Extracts package name from a node_modules path.
 * Uses the last node_modules/ to handle nested dependencies correctly.
 * Examples:
 *   "node_modules/react/index.js" -> "react"
 *   "node_modules/@types/node/index.d.ts" -> "@types/node"
 *   "node_modules/lodash/fp/map.js" -> "lodash"
 *   "node_modules/@rjsf/validator-ajv8/node_modules/ajv/dist/ajv.js" -> "ajv"
 * @param path module file path
 * @returns package name or null if not from node_modules
 */
export function extractPackageName(path: string): string | null {
  const normalizedPath = path.replace(/\\/g, '/')
  const lastNodeModulesIndex = normalizedPath.lastIndexOf('node_modules/')
  if (lastNodeModulesIndex === -1) {
    return null
  }

  const afterNodeModules = normalizedPath.substring(lastNodeModulesIndex + 'node_modules/'.length)
  const parts = afterNodeModules.split('/')

  // Handle scoped packages (e.g., @types/node)
  if (parts[0]?.startsWith('@')) {
    if (parts.length >= 2) {
      return `${parts[0]}/${parts[1]}`
    }
    return parts[0] || null
  }

  // Regular package (e.g., react, lodash)
  return parts[0] || null
}

/**
 * Extracts package root path for a module.
 * This distinguishes different physical installs of the same package, for example:
 * - "node_modules/react/index.js" -> "node_modules/react"
 * - "node_modules/hoist-non-react-statics/node_modules/react-is/index.js"
 *   -> "node_modules/hoist-non-react-statics/node_modules/react-is"
 * @param path module file path
 * @returns package root path or null if not from node_modules
 */
export function extractPackageRoot(path: string): string | null {
  const normalizedPath = path.replace(/\\/g, '/')
  const lastNodeModulesIndex = normalizedPath.lastIndexOf('node_modules/')
  if (lastNodeModulesIndex === -1) {
    return null
  }

  const before = normalizedPath.substring(0, lastNodeModulesIndex)
  const after = normalizedPath.substring(lastNodeModulesIndex + 'node_modules/'.length)
  const parts = after.split('/')

  if (!parts[0]) {
    return null
  }

  let packageSegment: string
  if (parts[0].startsWith('@')) {
    if (!parts[1]) {
      return null
    }
    packageSegment = `${parts[0]}/${parts[1]}`
  } else {
    packageSegment = parts[0]
  }

  return `${before}node_modules/${packageSegment}`
}

/**
 * Analyzes duplicate packages across chunks.
 * A package is considered duplicated if it appears in multiple chunks or has multiple physical installs.
 * @param stats bundle stats
 * @returns duplicate package statistics
 */
export function analyzeDuplicates(stats: BundleStats): DuplicateStats {
  const packageMap = new Map<string, {chunks: Set<string>; roots: Map<string, number>; totalSize: number}>()

  // Extract all modules and track which chunks they belong to
  const modules: Array<{path: string; size: number; chunkName: string}> = []

  // Extract modules from stats and associate with chunks
  if (!stats) {
    return {packages: [], totalDuplicateSize: 0, duplicateCount: 0}
  }

  // Helper to extract modules from a chunk
  const extractModulesFromChunk = (chunk: BundleChunk | undefined, chunkName: string): void => {
    if (!chunk) return

    const tempModules: Array<{path: string; size: number}> = []
    extractModulesRecursive(chunk, tempModules)

    for (const module of tempModules) {
      modules.push({...module, chunkName})
    }
  }

  // Extract modules from all chunks
  if (Array.isArray(stats)) {
    stats.forEach((module, index) => {
      const chunkName = module.filename || module.label || `module-${index}`
      extractModulesFromChunk(module, chunkName)
    })
  } else if ('chunks' in stats && stats.chunks) {
    for (const [key, chunk] of Object.entries(stats.chunks)) {
      const chunkName = chunk?.filename || key
      extractModulesFromChunk(chunk, chunkName)
    }
  } else if (stats.modules && Array.isArray(stats.modules)) {
    stats.modules.forEach((module, index) => {
      const chunkName = module.filename || module.label || `module-${index}`
      extractModulesFromChunk(module, chunkName)
    })
  }

  // Group modules by package and track chunks
  for (const module of modules) {
    const packageName = extractPackageName(module.path)
    const packageRoot = extractPackageRoot(module.path)
    if (!packageName || !packageRoot) continue

    const existing = packageMap.get(packageName)
    if (existing) {
      existing.chunks.add(module.chunkName)
      const rootSize = existing.roots.get(packageRoot) ?? 0
      existing.roots.set(packageRoot, rootSize + module.size)
      existing.totalSize += module.size
    } else {
      packageMap.set(packageName, {
        chunks: new Set([module.chunkName]),
        roots: new Map([[packageRoot, module.size]]),
        totalSize: module.size,
      })
    }
  }

  // Find duplicates (packages appearing in multiple chunks)
  const duplicatePackages: DuplicatePackage[] = []
  let totalDuplicateSize = 0

  for (const [packageName, data] of packageMap.entries()) {
    const rootCount = data.roots.size
    const chunkCount = data.chunks.size

    // A package is considered duplicated if it has multiple physical installs (roots)
    // or if it is split across multiple chunks.
    const installationCount = rootCount > 1 ? rootCount : chunkCount

    if (installationCount > 1) {
      // This package appears multiple times - estimate wasted size based on installations
      const uniqueSize = data.totalSize / installationCount
      const duplicateSize = data.totalSize - uniqueSize // Extra size due to duplication
      totalDuplicateSize += duplicateSize

      duplicatePackages.push({
        packageName,
        occurrences: installationCount,
        totalSize: data.totalSize,
        chunks: Array.from(data.chunks).sort(),
        roots: Array.from(data.roots.keys()).sort(),
      })
    }
  }

  // Sort by duplicate size (descending)
  duplicatePackages.sort((a, b) => {
    const aDuplicateSize = a.totalSize - a.totalSize / a.occurrences
    const bDuplicateSize = b.totalSize - b.totalSize / b.occurrences
    return bDuplicateSize - aDuplicateSize
  })

  return {
    packages: duplicatePackages,
    totalDuplicateSize,
    duplicateCount: duplicatePackages.length,
  }
}

/**
 * Calculates bundle breakdown by analyzing all modules.
 * @param stats bundle stats
 * @returns breakdown with sizes for code and CSS
 */
export function calculateBreakdown(stats: BundleStats): BundleBreakdown {
  const breakdown: BundleBreakdown = {
    code: 0,
    css: 0,
  }

  if (!stats) return breakdown

  const modules: Array<{path: string; size: number}> = []

  // Extract all modules from stats
  if (Array.isArray(stats)) {
    for (const module of stats) {
      extractModulesRecursive(module, modules)
    }
  } else if ('chunks' in stats && stats.chunks) {
    for (const chunk of Object.values(stats.chunks)) {
      extractModulesRecursive(chunk, modules)
    }
  } else if (stats.modules && Array.isArray(stats.modules)) {
    for (const module of stats.modules) {
      extractModulesRecursive(module, modules)
    }
  }

  // Categorize and sum up sizes
  for (const module of modules) {
    const category = categorizeModule(module.path)
    if (category === 'css') {
      breakdown.css += module.size
    } else {
      // Both 'own' and 'external' go into code
      breakdown.code += module.size
    }
  }

  return breakdown
}

/**
 * Gets bundle information from stats file.
 * @param appName app name
 * @param variant build variant
 * @param tool build tool
 * @param statsDir directory containing stats files
 * @returns bundle info or null if not found
 */
export async function getBundleInfo(appName: string, variant: string, tool: string, statsDir: string): Promise<BundleInfo | null> {
  // Read stats from central location in monorepo root
  const statPath = join(statsDir, `${appName}-${variant}-${tool}.json`)

  if (!existsSync(statPath)) {
    return null
  }

  try {
    const content = readFileSync(statPath, 'utf-8')
    const stats: BundleStats = JSON.parse(content)
    const totalSize = calculateTotalSize(stats)

    const chunks: Record<string, BundleChunk> = {}

    if (!stats) {
      // stats is undefined, skip
    } else if (Array.isArray(stats)) {
      stats.forEach((module, index) => {
        if (!module.filename) return
        // Use actualSize (saved during build), fall back to other metrics
        const actualSize = module.actualSize ?? module.size ?? module.parsedSize ?? module.statSize ?? 0
        chunks[module.filename || module.label || `module-${index}`] = {...module, actualSize}
      })
    } else if ('chunks' in stats && stats.chunks) {
      for (const [key, chunk] of Object.entries(stats.chunks)) {
        if (!chunk?.filename) continue
        const actualSize = chunk.actualSize ?? chunk.size ?? chunk.parsedSize ?? chunk.statSize ?? 0
        chunks[chunk.filename || key] = {...chunk, actualSize}
      }
    } else if (stats.modules && Array.isArray(stats.modules)) {
      stats.modules.forEach((module, index) => {
        if (!module.filename) return
        const actualSize = module.actualSize ?? module.size ?? module.parsedSize ?? module.statSize ?? 0
        chunks[module.filename || module.label || `module-${index}`] = {...module, actualSize}
      })
    }

    // Calculate raw breakdown based on actual chunk file sizes.
    // This keeps Code/CSS numbers consistent with Total Size, using the same source of truth.
    let codeSize = 0
    let cssSize = 0

    for (const [filename, chunk] of Object.entries(chunks)) {
      const size = chunk.actualSize ?? chunk.size ?? chunk.parsedSize ?? chunk.statSize ?? 0
      if (filename.endsWith('.css')) {
        cssSize += size
      } else if (filename.endsWith('.js')) {
        codeSize += size
      }
    }

    const breakdown: BundleBreakdown = {
      code: codeSize,
      css: cssSize,
    }

    const duplicates = analyzeDuplicates(stats)

    // Calculate compressed sizes from actual files
    const buildOutputDir = join(statsDir, `${appName}-${variant}-${tool}`)
    let totalSizeGzip: number | undefined
    let breakdownGzip: BundleBreakdown | undefined

    if (existsSync(buildOutputDir)) {
      // Calculate compressed sizes for all JS and CSS files
      let totalGzip = 0
      let codeGzip = 0
      let cssGzip = 0

      for (const chunk of Object.values(chunks)) {
        // Use the filename from the chunk object, not the key
        // The filename might be a relative path that needs to be normalized
        let filename = chunk.filename
        if (!filename) continue

        // Normalize filename: remove leading ./ and normalize path separators
        filename = filename.replace(/^\.\//, '').replace(/\\/g, '/')

        const filePath = join(buildOutputDir, filename)
        const compressed = await getCompressedSizes(filePath)
        if (compressed) {
          totalGzip += compressed.gzip

          // Determine if it's CSS or JS based on filename
          if (filename.endsWith('.css')) {
            cssGzip += compressed.gzip
          } else {
            codeGzip += compressed.gzip
          }
        }
      }

      if (totalGzip > 0) {
        totalSizeGzip = totalGzip
        breakdownGzip = {code: codeGzip, css: cssGzip}
      }
    }

    return {
      app: appName,
      variant,
      buildTool: tool,
      totalSize,
      totalSizeGzip,
      chunks,
      breakdown,
      breakdownGzip,
      duplicates,
    }
  } catch (error) {
    console.error(`Error reading ${statPath}:`, (error as Error).message)
    return null
  }
}
