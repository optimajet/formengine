#!/usr/bin/env node

import {execSync} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const sourceDir = path.join(__dirname, '..')
const packageJson = 'package.json'
const tempDir = path.join(__dirname, 'package')

function removePath(pathToRemove: string): void {
  if (fs.existsSync(pathToRemove)) {
    fs.rmSync(pathToRemove, {recursive: true})
  }
}

function readJsonFile(file: string): Record<string, unknown> {
  const buffer = fs.readFileSync(file, 'utf8')
  return JSON.parse(buffer) as Record<string, unknown>
}

function copyFiles(): void {
  removePath(tempDir)
  fs.mkdirSync(tempDir, {recursive: true})

  fs.copyFileSync(
    path.join(sourceDir, packageJson),
    path.join(tempDir, packageJson),
  )
  fs.copyFileSync(
    path.join(sourceDir, 'README.md'),
    path.join(tempDir, 'README.md'),
  )
  fs.copyFileSync(
    path.join(sourceDir, 'LICENSE'),
    path.join(tempDir, 'LICENSE'),
  )
  const dirName = 'dist'
  const srcDir = path.join(sourceDir, dirName)
  const destDir = path.join(tempDir, dirName)
  fs.cpSync(srcDir, destDir, {recursive: true})
}

function patchPackageJson(): void {
  const data = readJsonFile(packageJson)
  const patch = readJsonFile(path.join(__dirname, 'part.package.json'))
  delete data.scripts
  Object.assign(data, patch)
  const patchedData = JSON.stringify(data, undefined, '  ')
  fs.writeFileSync(path.join(tempDir, packageJson), patchedData, 'utf-8')
}

function pack(): void {
  execSync('npm pack', {cwd: tempDir})
  const buffer = fs.readFileSync(packageJson, 'utf8')
  const data = JSON.parse(buffer) as {name: string; version: string}
  const filename = `${data.name}-${data.version}.tgz`.replace('@', '').replace('/', '-')
  fs.renameSync(path.join(tempDir, filename), path.join(sourceDir, filename))
}

copyFiles()
patchPackageJson()
pack()
removePath(tempDir)
