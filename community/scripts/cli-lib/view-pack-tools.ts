import {readdirSync, readFileSync} from 'node:fs'
import {dirname, join, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

/**
 * Lists files in a directory whose names match a regex.
 * @param dir directory to scan
 * @param maskRegex file name pattern
 */
export function getFilesByMask(dir: string, maskRegex: RegExp): string[] {
  const entries = readdirSync(dir, {withFileTypes: true})
  const matchedFiles: string[] = []

  for (const entry of entries) {
    if (entry.isFile() && maskRegex.test(entry.name)) {
      matchedFiles.push(join(dir, entry.name))
    }
  }

  return matchedFiles
}

export interface PackageExport {
  import: string
  types?: string
  require?: string
  [key: string]: string | undefined
}

export interface PackageJson {
  name: string
  version: string
  scripts: Record<string, string>
  exports: Record<string, PackageExport | string>
  files?: string[]
  [key: string]: unknown
}

export const packageJsonFileName = 'package.json'

/**
 * Reads and parses a JSON file.
 * @param filePath path to the file
 */
export function readJsonFile<T>(filePath: string): T {
  const buffer = readFileSync(filePath, 'utf8')
  return JSON.parse(buffer) as T
}

/**
 * Reads package.json from a package root directory.
 * @param sourceDir package root
 */
export function readPackageJson(sourceDir: string): PackageJson {
  return readJsonFile<PackageJson>(join(sourceDir, packageJsonFileName))
}

/**
 * Rewrites export map entries to point at built dist/*.js and dist/*.d.ts files.
 * @param packageJson mutable package.json object
 */
export function patchExports(packageJson: PackageJson): void {
  Object.entries(packageJson.exports).forEach(([name, entry]) => {
    if (typeof entry === 'string') {
      return
    }

    if (entry.import.endsWith('.json')) {
      return
    }

    const fn = name === '.' ? 'index' : name
    const itemName = fn.replace('./', '')

    entry.import = `./dist/${itemName}.js`
    entry.types = `./dist/${itemName}.d.ts`

    if (name === '.') {
      entry.require = `./dist/${itemName}.js`
    }
  })
}

/**
 * Maps export subpaths to absolute file paths for bundler entry resolution.
 * @param basePath package root
 * @param packageJson parsed package.json
 */
export function exportsToEntries(basePath: string, packageJson: PackageJson): Record<string, string> {
  return Object.entries(packageJson.exports).reduce(
    (acc, [name, entry]) => {
      if (name === './package.json') {
        return acc
      }

      if (typeof entry === 'string') {
        return acc
      }

      if (entry.import.endsWith('.json')) {
        return acc
      }

      const fn = (name === '.' ? 'index' : name).replace('./', '')

      acc[fn] = resolve(basePath, entry.import)

      return acc
    },
    {} as Record<string, string>
  )
}

/**
 * Resolves __dirname from import.meta.url (ESM).
 * @param importMetaUrl import.meta.url
 */
export function getDirname(importMetaUrl: string): string {
  return dirname(fileURLToPath(importMetaUrl))
}
