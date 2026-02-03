import {execSync} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const includeFiles = ['README.md', 'LICENSE', '*.js.map', '*.d.ts', '*.js', 'persisted-form.schema.json', 'package.json']

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const sourceDir = path.join(__dirname, '..')
const packageJson = 'package.json'
const tempDir = path.join(__dirname, 'package')
// eslint-disable-next-line @typescript-eslint/no-use-before-define
const packageFiles = getFiles()

function removePath(pathToRemove: string): void {
  if (fs.existsSync(pathToRemove)) {
    fs.rmSync(pathToRemove, {recursive: true})
  }
}

function readJsonFile(file: string): Record<string, unknown> {
  const buffer = fs.readFileSync(file, 'utf8')
  return JSON.parse(buffer) as Record<string, unknown>
}


function createGlobRegExp(mask: string): RegExp {
  const escaped = mask.replace(/[.+^${}()|[\]\\]/g, '\\$&')
  const regex = escaped.replace(/\*/g, '.*')
  return new RegExp(`^${regex}$`)
}

function findFileInDirectory(
  dir: string,
  fileName: string,
  relativePath: string = '',
): string | null {
  if (!fs.existsSync(dir)) {
    return null
  }

  const entries = fs.readdirSync(dir, {withFileTypes: true})

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativeFilePath = relativePath
      ? path.join(relativePath, entry.name)
      : entry.name

    if (entry.isDirectory()) {
      const found = findFileInDirectory(fullPath, fileName, relativeFilePath)
      if (found) {
        return found
      }
    } else if (entry.name === fileName) {
      return relativeFilePath
    }
  }

  return null
}

function getFiles(): string[] {
  const distDir = path.join(sourceDir, 'dist')
  const distFiles = fs.existsSync(distDir) ? fs.readdirSync(distDir) : []
  const files = new Set<string>()

  includeFiles.forEach((mask) => {
    const hasGlob = mask.includes('*')

    if (hasGlob) {
      const matcher = createGlobRegExp(mask)
      distFiles
        .filter((distFile) => matcher.test(distFile))
        .forEach((distFile) => files.add(path.join('dist', distFile)))
      return
    }

    // First check if file exists directly in dist/
    const distPath = path.join(distDir, mask)
    if (fs.existsSync(distPath)) {
      files.add(path.join('dist', mask))
      return
    }

    // If not found directly, search recursively in dist/ subdirectories
    const foundInDist = findFileInDirectory(distDir, mask)
    if (foundInDist) {
      files.add(path.join('dist', foundInDist))
      return
    }

    // Finally check in root directory
    const rootPath = path.join(sourceDir, mask)
    if (fs.existsSync(rootPath)) {
      files.add(mask)
    }
  })

  return [...files]
}

function copyFiles(): void {
  removePath(tempDir)
  fs.mkdirSync(tempDir, {recursive: true})

  fs.copyFileSync(
    path.join(sourceDir, packageJson),
    path.join(tempDir, packageJson),
  )
  packageFiles.forEach((file) => {
    const sourceFile = path.join(sourceDir, file)
    if (fs.existsSync(sourceFile)) {
      const dest = path.join(tempDir, file)
      const dirname = path.dirname(dest)
      fs.mkdirSync(dirname, {recursive: true})
      fs.copyFileSync(sourceFile, dest)
    }
  })
}

function normalizePackageFiles(files: string[]): string[] {
  return files.map(file => file.split(path.sep).join('/'))
}

function patchPackageJson(): void {
  const data = readJsonFile(packageJson)
  const patch = readJsonFile(path.join(__dirname, 'part.package.json'))
  const normalizedFiles = normalizePackageFiles(packageFiles)

  delete data.scripts
  Object.assign(data, patch, {files: normalizedFiles})
  const patchedData = JSON.stringify(data, undefined, '  ')
  fs.writeFileSync(path.join(tempDir, packageJson), patchedData, 'utf-8')
}

function pack(): void {
  execSync('npm pack', {cwd: tempDir})
  const buffer = fs.readFileSync(packageJson, 'utf8')
  const data = JSON.parse(buffer) as { name: string; version: string }
  const filename = `${data.name}-${data.version}.tgz`
    .replace('@', '')
    .replace('/', '-')
  fs.renameSync(
    path.join(tempDir, filename),
    path.join(sourceDir, filename),
  )
}

copyFiles()
patchPackageJson()
pack()
removePath(tempDir)
