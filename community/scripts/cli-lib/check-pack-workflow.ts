import {execSync} from 'node:child_process'
import {existsSync, mkdirSync, readdirSync, readFileSync} from 'node:fs'
import {basename, join, relative} from 'node:path'

import {removePath} from './fs-utils.ts'
import {readPackageJson} from './view-pack-tools.ts'

/**
 * Validates an existing npm tarball against package.json "files" and export map entries.
 * @param configDir directory of check-pack.ts (same as other config scripts)
 */
export function runCheckPack(configDir: string): void {
  const sourceDir = join(configDir, '..')
  const extractDir = join(configDir, 'package-check', 'extracted')

  try {
    console.log('📦 Looking for packed npm package...')
    const tarballPath = findTarball(sourceDir)
    console.log(`   Found: ${basename(tarballPath)}`)

    console.log('📦 Extracting tarball for inspection...')
    const extractedPackageDir = extractTarball(tarballPath, extractDir)

    const success = checkPackageContents(sourceDir, extractedPackageDir)

    if (!success) {
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error during package check:', error)
    process.exit(1)
  } finally {
    removePath(join(configDir, 'package-check'))
  }
}

function findTarball(sourceDir: string): string {
  const packageJson = readPackageJson(sourceDir)
  const filename = `${packageJson.name}-${packageJson.version}.tgz`.replace('@', '').replace('/', '-')
  const tarballPath = join(sourceDir, filename)

  if (!existsSync(tarballPath)) {
    throw new Error(`Tarball not found: ${filename}\nPlease run 'npm run pack' first to create the package tarball.`)
  }

  return tarballPath
}

function extractTarball(tarballPath: string, extractDir: string): string {
  mkdirSync(extractDir, {recursive: true})
  execSync(`tar -xzf "${tarballPath}" -C "${extractDir}"`, {stdio: 'pipe'})

  const entries = readdirSync(extractDir, {withFileTypes: true})
  const packageDir = entries.find(entry => entry.isDirectory())

  if (!packageDir) {
    throw new Error('Failed to find extracted package directory')
  }

  return join(extractDir, packageDir.name)
}

function checkPackageContents(sourceDir: string, extractedPackageDir: string): boolean {
  const sourcePackageJson = readPackageJson(sourceDir)

  if (!existsSync(extractedPackageDir)) {
    console.error(`❌ Extracted package directory not found: ${extractedPackageDir}`)
    return false
  }

  const errors: string[] = []
  const warnings: string[] = []

  const extractedPackageJsonPath = join(extractedPackageDir, 'package.json')
  if (!existsSync(extractedPackageJsonPath)) {
    errors.push('Missing package.json in packed package')
    console.error('\n❌ Errors found:')
    errors.forEach(error => console.error(`   - ${error}`))
    return false
  }

  const extractedPackageJson = JSON.parse(readFileSync(extractedPackageJsonPath, 'utf-8')) as Record<string, unknown>

  const requiredFiles: string[] = Array.isArray(sourcePackageJson.files) ? sourcePackageJson.files : []
  for (const filePattern of requiredFiles) {
    if (filePattern === 'dist/*') {
      const distPath = join(extractedPackageDir, 'dist')
      if (!existsSync(distPath)) {
        errors.push('Missing required directory: dist/')
      }
    } else {
      const filePath = join(extractedPackageDir, filePattern)
      if (!existsSync(filePath)) {
        errors.push(`Missing required file: ${filePattern}`)
      }
    }
  }

  if (extractedPackageJson.exports && typeof extractedPackageJson.exports === 'object') {
    const distPath = join(extractedPackageDir, 'dist')
    if (existsSync(distPath)) {
      const distFileSet = new Set<string>()

      function collectFiles(dir: string, baseDir: string = distPath): void {
        const entries = readdirSync(dir, {withFileTypes: true})
        for (const entry of entries) {
          const fullPath = join(dir, entry.name)
          const relativePath = relative(baseDir, fullPath)
          if (entry.isDirectory()) {
            collectFiles(fullPath, baseDir)
          } else {
            distFileSet.add(relativePath.replace(/\\/g, '/'))
          }
        }
      }

      collectFiles(distPath)

      for (const [subpath, mapping] of Object.entries(extractedPackageJson.exports as Record<string, unknown>)) {
        if (typeof mapping === 'object' && mapping !== null && 'import' in mapping) {
          const exportMapping = mapping as {import?: string; types?: string}
          if (exportMapping.import) {
            const exportPath = exportMapping.import.replace('./dist/', '').replace(/\\/g, '/')
            if (!distFileSet.has(exportPath)) {
              errors.push(`Missing exported file in dist/: ${exportPath} (export: ${subpath})`)
            }

            if (!exportMapping.import.startsWith('./dist/')) {
              warnings.push(`Export ${subpath} import path should start with ./dist/: ${exportMapping.import}`)
            }
          }

          if (exportMapping.types) {
            const typesPath = exportMapping.types.replace('./dist/', '').replace(/\\/g, '/')
            if (!distFileSet.has(typesPath)) {
              errors.push(`Missing type definition file in dist/: ${typesPath} (export: ${subpath})`)
            }

            if (!exportMapping.types.startsWith('./dist/')) {
              warnings.push(`Export ${subpath} types path should start with ./dist/: ${exportMapping.types}`)
            }
          }
        }
      }
    } else {
      errors.push('Missing dist/ directory in packed package')
    }
  }

  console.log(`\n📦 Checking packed npm package: ${sourcePackageJson.name}@${sourcePackageJson.version}`)
  console.log(`   Extracted to: ${extractedPackageDir}`)

  if (errors.length > 0) {
    console.error('\n❌ Errors found:')
    errors.forEach(error => console.error(`   - ${error}`))
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  Warnings:')
    warnings.forEach(warning => console.warn(`   - ${warning}`))
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ All required files are present in the packed package!')
    return true
  }

  return errors.length === 0
}
