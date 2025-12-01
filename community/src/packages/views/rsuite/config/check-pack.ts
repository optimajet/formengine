// @ts-nocheck TS5097 allow .ts import

import {execSync} from 'node:child_process'
import {existsSync, mkdirSync, readdirSync, readFileSync} from 'node:fs'
import {basename, join, relative} from 'node:path'
import {getDirname, readPackageJson, removePath} from './build-tools.ts'

const __dirname = getDirname(import.meta.url)
const sourceDir = join(__dirname, '..')
const extractDir = join(__dirname, 'package-check', 'extracted')

function findTarball(): string {
  const packageJson = readPackageJson(sourceDir)
  const filename = `${packageJson.name}-${packageJson.version}.tgz`.replace('@', '').replace('/', '-')
  const tarballPath = join(sourceDir, filename)

  if (!existsSync(tarballPath)) {
    throw new Error(`Tarball not found: ${filename}\nPlease run 'npm run pack' first to create the package tarball.`)
  }

  return tarballPath
}

function extractTarball(tarballPath: string): string {
  mkdirSync(extractDir, {recursive: true})
  execSync(`tar -xzf "${tarballPath}" -C "${extractDir}"`, {stdio: 'pipe'})

  // Find the extracted package directory
  const entries = readdirSync(extractDir, {withFileTypes: true})
  const packageDir = entries.find(entry => entry.isDirectory())

  if (!packageDir) {
    throw new Error('Failed to find extracted package directory')
  }

  return join(extractDir, packageDir.name)
}

function checkPackageContents(extractedPackageDir: string): boolean {
  const sourcePackageJson = readPackageJson(sourceDir)

  if (!existsSync(extractedPackageDir)) {
    console.error(`❌ Extracted package directory not found: ${extractedPackageDir}`)
    return false
  }

  const errors: string[] = []
  const warnings: string[] = []

  // Read the patched package.json from the extracted package
  const extractedPackageJsonPath = join(extractedPackageDir, 'package.json')
  if (!existsSync(extractedPackageJsonPath)) {
    errors.push('Missing package.json in packed package')
    console.error('\n❌ Errors found:')
    errors.forEach(error => console.error(`   - ${error}`))
    return false
  }

  const extractedPackageJson = JSON.parse(readFileSync(extractedPackageJsonPath, 'utf-8'))

  // Check required files from package.json "files" field
  const requiredFiles: string[] = Array.isArray(sourcePackageJson.files) ? sourcePackageJson.files : []
  for (const filePattern of requiredFiles) {
    if (filePattern === 'dist/*') {
      // Check that dist directory exists
      const distPath = join(extractedPackageDir, 'dist')
      if (!existsSync(distPath)) {
        errors.push(`Missing required directory: dist/`)
      }
    } else {
      const filePath = join(extractedPackageDir, filePattern)
      if (!existsSync(filePath)) {
        errors.push(`Missing required file: ${filePattern}`)
      }
    }
  }

  // Check that all exported files exist in dist/ (using the patched package.json)
  if (extractedPackageJson.exports && typeof extractedPackageJson.exports === 'object') {
    const distPath = join(extractedPackageDir, 'dist')
    if (existsSync(distPath)) {
      // Recursively collect all files in dist/
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

      for (const [subpath, mapping] of Object.entries(extractedPackageJson.exports)) {
        if (typeof mapping === 'object' && mapping !== null && 'import' in mapping) {
          const exportMapping = mapping as {import?: string; types?: string}
          // Extract the file path from the export (e.g., "./dist/index.js" -> "index.js")
          if (exportMapping.import) {
            const exportPath = exportMapping.import.replace('./dist/', '').replace(/\\/g, '/')
            if (!distFileSet.has(exportPath)) {
              errors.push(`Missing exported file in dist/: ${exportPath} (export: ${subpath})`)
            }

            // Verify that exports point to dist/ files
            if (!exportMapping.import.startsWith('./dist/')) {
              warnings.push(`Export ${subpath} import path should start with ./dist/: ${exportMapping.import}`)
            }
          }

          // Check for .d.ts file if types are specified
          if (exportMapping.types) {
            const typesPath = exportMapping.types.replace('./dist/', '').replace(/\\/g, '/')
            if (!distFileSet.has(typesPath)) {
              errors.push(`Missing type definition file in dist/: ${typesPath} (export: ${subpath})`)
            }

            // Verify that exports point to dist/ files
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

  // Output results
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

function main(): void {
  try {
    console.log('📦 Looking for packed npm package...')
    const tarballPath = findTarball()
    console.log(`   Found: ${basename(tarballPath)}`)

    console.log('📦 Extracting tarball for inspection...')
    const extractedPackageDir = extractTarball(tarballPath)

    const success = checkPackageContents(extractedPackageDir)

    if (!success) {
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error during package check:', error)
    process.exit(1)
  } finally {
    removePath(join(__dirname, 'package-check'))
  }
}

main()
