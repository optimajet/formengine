import fs, {existsSync, readdirSync, readFileSync} from 'node:fs'
import {dirname, join, relative, resolve} from 'node:path'
import enhancedResolve from 'enhanced-resolve'

import {readPackageJson} from './view-pack-tools.ts'

const {CachedInputFileSystem, ResolverFactory} = enhancedResolve

const javascriptFilePattern = /\.[cm]?js$/
const skippedSpecifierPattern = /^(?:node:|data:|blob:|https?:|virtual:)/

const webpackResolver = ResolverFactory.createResolver({
  fileSystem: new CachedInputFileSystem(fs, 4000),
  useSyncFileSystemCalls: true,
  extensions: ['.js', '.mjs', '.json'],
  fullySpecified: true,
  conditionNames: ['import', 'module', 'webpack', 'browser', 'default'],
  mainFields: ['browser', 'module', 'main'],
})

/**
 * Fails pack when dist ESM imports are not resolvable with webpack's fullySpecified rules.
 * @param packageDir package root that contains dist/
 */
export function checkWebpackFullySpecifiedImports(packageDir: string): void {
  const absolutePackageDir = resolve(packageDir)
  const distDir = join(absolutePackageDir, 'dist')
  if (!existsSync(distDir)) {
    return
  }

  const files = collectJavaScriptFiles(distDir)
  if (files.length === 0) {
    return
  }

  const packageJson = readPackageJson(absolutePackageDir)
  const failures: string[] = []

  console.log('🔍 Checking dist imports with webpack fullySpecified resolve...')

  for (const filePath of files) {
    const source = readFileSync(filePath, 'utf8')
    const specifiers = collectImportSpecifiers(source)
    const contextDir = dirname(filePath)

    for (const specifier of specifiers) {
      if (skippedSpecifierPattern.test(specifier)) {
        continue
      }

      try {
        webpackResolver.resolveSync({}, contextDir, specifier)
      } catch (error) {
        const reason = error instanceof Error ? error.message.split('\n')[0] : String(error)
        const file = relative(absolutePackageDir, filePath).replaceAll('\\', '/')
        failures.push(`  ${file}: ${specifier}\n    ${reason}`)
      }
    }
  }

  if (failures.length === 0) {
    console.log('✅ Dist imports resolve with webpack fullySpecified.')
    return
  }

  throw new Error(`Webpack fullySpecified resolve failed for ${packageJson.name}:\n${failures.join('\n')}`)
}

function collectJavaScriptFiles(dir: string): string[] {
  const files: string[] = []
  const entries = readdirSync(dir, {withFileTypes: true})

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectJavaScriptFiles(fullPath))
      continue
    }

    if (javascriptFilePattern.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

function collectImportSpecifiers(source: string): string[] {
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\])\/\/.*$/gm, '$1')
  const specifiers = new Set<string>()
  const patterns = [
    /\b(?:import|export)\b(?!\s*\()[^'";]*?from\s*['"]([^'"]+)['"]/g,
    /(?:^|[;\n])\s*import\s*['"]([^'"]+)['"]/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ]

  for (const pattern of patterns) {
    for (const match of withoutComments.matchAll(pattern)) {
      const specifier = match[1]
      if (specifier && isModuleSpecifier(specifier)) {
        specifiers.add(specifier)
      }
    }
  }

  return [...specifiers]
}

function isModuleSpecifier(specifier: string): boolean {
  return !specifier.includes('${') && !/\s/.test(specifier) && /^[\w@./~-]/.test(specifier)
}
