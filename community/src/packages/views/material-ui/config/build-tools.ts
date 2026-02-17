import {existsSync, readdirSync, readFileSync, rmSync} from 'node:fs'
import {dirname, join, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

export function getFilesByMask(dir: string, maskRegex: RegExp) {
  const entries = readdirSync(dir, {withFileTypes: true})
  const matchedFiles = []

  for (const entry of entries) {
    if (entry.isFile() && maskRegex.test(entry.name)) {
      matchedFiles.push(join(dir, entry.name))
    }
  }

  return matchedFiles
}

interface PackageExport {
  import: string
  types?: string

  [key: string]: string | undefined
}

export interface PackageJson {
  name: string
  version: string
  scripts: Record<string, string>
  exports: Record<string, PackageExport | string>

  [key: string]: unknown
}

export const packageJsonFileName = 'package.json'

export function readJsonFile<T>(filePath: string): T {
  const buffer = readFileSync(filePath, 'utf8')
  return JSON.parse(buffer) as T
}

export function readPackageJson(sourceDir: string): PackageJson {
  return readJsonFile<PackageJson>(join(sourceDir, packageJsonFileName))
}

export function patchExports(packageJson: PackageJson): void {
  Object.entries(packageJson.exports).forEach(([name, entry]) => {
    // Skip string entries (like JSON schemas) as they are not TypeScript modules
    if (typeof entry === 'string') {
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

export function exportsToEntries(basePath: string, packageJson: PackageJson): Record<string, string> {
  return Object.entries(packageJson.exports).reduce((acc, [name, entry]) => {
    // Skip string entries (like JSON schemas) as they are not TypeScript modules
    if (typeof entry === 'string') {
      return acc
    }

    const fn = (name === '.' ? 'index' : name).replace('./', '')

    acc[fn] = resolve(basePath, entry.import)

    return acc
  }, {} as any)
}

export function removePath(targetPath: string): void {
  if (existsSync(targetPath)) {
    rmSync(targetPath, {recursive: true, force: true})
  }
}

export function getDirname(url: string) {
  const __filename = fileURLToPath(url)
  return dirname(__filename)
}
