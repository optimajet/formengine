import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'
import {copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync} from 'node:fs'
import {execSync} from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const sourceDir = join(__dirname, '..')
const packageJson = 'package.json'
const tempDir = join(__dirname, 'package')

function removePath(path) {
  if (existsSync(path)) rmSync(path, {recursive: true})
}

function readJsonFile(file) {
  const buffer = readFileSync(file, 'utf8')
  return JSON.parse(buffer)
}

function copyFiles() {
  removePath(tempDir)
  mkdirSync(tempDir, {recursive: true})

  copyFileSync(join(sourceDir, packageJson), join(tempDir, packageJson))
  copyFileSync(join(sourceDir, 'README.md'), join(tempDir, 'README.md'))
  copyFileSync(join(sourceDir, 'LICENSE'), join(tempDir, 'LICENSE'))
  const dirName = 'dist'
  const srcDir = join(sourceDir, dirName)
  const destDir = join(tempDir, dirName)
  cpSync(srcDir, destDir, {recursive: true})
}

function patchPackageJson() {
  const data = readJsonFile(packageJson)
  const patch = readJsonFile(join(__dirname, 'part.package.json'))
  delete data.scripts
  Object.assign(data, patch)
  const patchedData = JSON.stringify(data, undefined, '  ')
  writeFileSync(join(tempDir, packageJson), patchedData, 'utf-8')
}

function pack() {
  execSync('npm pack', {cwd: tempDir})
  const buffer = readFileSync(packageJson, 'utf8')
  const data = JSON.parse(buffer)
  const filename = `${data.name}-${data.version}.tgz`.replace('@', '').replace('/', '-')
  renameSync(join(tempDir, filename), join(sourceDir, filename))
}

copyFiles()
patchPackageJson()
pack()
removePath(tempDir)
