// @ts-nocheck TS5097 allow .ts import

import {execSync} from 'node:child_process'
import {copyFileSync, cpSync, mkdirSync, renameSync, writeFileSync} from 'node:fs'
import {join} from 'node:path'
import type {PackageJson} from './build-tools.ts'
import {getDirname, packageJsonFileName, patchExports, readJsonFile, readPackageJson, removePath} from './build-tools.ts'

const __dirname = getDirname(import.meta.url)
const sourceDir = join(__dirname, '..')
const tempDir = join(__dirname, 'package')

function copyFiles(): void {
  removePath(tempDir)
  mkdirSync(tempDir, {recursive: true})

  const filesToCopy = ['README.md', 'LICENSE', packageJsonFileName]
  filesToCopy.forEach(fileName => {
    copyFileSync(join(sourceDir, fileName), join(tempDir, fileName))
  })

  const dirName = 'dist'
  const srcDir = join(sourceDir, dirName)
  const destDir = join(tempDir, dirName)

  cpSync(srcDir, destDir, {recursive: true})
}

function patchPackageJson(): void {
  const packageJson = readJsonFile<PackageJson>(join(sourceDir, packageJsonFileName))
  const patch = readJsonFile<Partial<PackageJson>>(join(__dirname, 'part.package.json'))

  const exportsPatch = patch.exports
  delete patch.exports

  delete packageJson.scripts
  patchExports(packageJson)
  Object.assign(packageJson, patch)
  packageJson.exports = {...packageJson.exports, ...exportsPatch}

  const patchedData = JSON.stringify(packageJson, undefined, 2)
  writeFileSync(join(tempDir, packageJsonFileName), `${patchedData}\n`, 'utf-8')
}

function pack(): void {
  execSync('npm pack', {cwd: tempDir, stdio: 'inherit'})

  const data = readPackageJson(sourceDir)
  const filename = `${data.name}-${data.version}.tgz`.replace('@', '').replace('/', '-')

  renameSync(join(tempDir, filename), join(sourceDir, filename))
}

function main(): void {
  try {
    copyFiles()
    patchPackageJson()
    pack()
  } finally {
    removePath(tempDir)
  }
}

main()
