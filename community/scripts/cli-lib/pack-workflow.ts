import {copyFileSync, cpSync, existsSync, mkdirSync, renameSync, writeFileSync} from 'node:fs'
import {dirname, join} from 'node:path'

import {checkWebpackFullySpecifiedImports} from './check-webpack-imports.ts'
import {removePath} from './fs-utils.ts'
import {readJson, writeJson} from './json-fs.ts'
import {moveTarballToPackageRoot, runNpmPack} from './npm-pack.ts'
import type {PackageJson} from './view-pack-tools.ts'
import {packageJsonFileName, patchExports, readJsonFile, readPackageJson} from './view-pack-tools.ts'

const CLI_LIB_PACKAGE_NAME = '@react-form-builder/cli-lib'

/** Reads name/version from the workspace package.json (absolute path). */
function readPackageIdentityAt(sourceDir: string): {name: string; version: string} {
  return readJson<{name: string; version: string}>(join(sourceDir, packageJsonFileName))
}

function getManifestFiles(sourceDir: string): string[] {
  const data = readJson<Record<string, unknown>>(join(sourceDir, packageJsonFileName))
  const files = data.files
  return Array.isArray(files) ? (files as string[]) : []
}

export type ManifestCopyMode = 'cp-if-exists' | 'copy-file' | 'cp'

/**
 * Packs a workspace package using the "files" field from package.json.
 * @param configDir directory containing part.package.json (usually config/)
 * @param mode how each listed file is copied into the staging folder
 */
export function runPackManifestFiles(configDir: string, mode: ManifestCopyMode): void {
  const sourceDir = join(configDir, '..')
  const tempDir = join(configDir, 'package')
  checkWebpackFullySpecifiedImports(sourceDir)

  try {
    removePath(tempDir)
    mkdirSync(tempDir, {recursive: true})

    copyFileSync(join(sourceDir, packageJsonFileName), join(tempDir, packageJsonFileName))

    const files = getManifestFiles(sourceDir)
    for (const file of files) {
      const src = join(sourceDir, file)
      const dest = join(tempDir, file)
      mkdirSync(dirname(dest), {recursive: true})

      if (mode === 'cp-if-exists') {
        if (existsSync(src)) {
          cpSync(src, dest, {recursive: true})
        }
      } else if (mode === 'copy-file') {
        copyFileSync(src, dest)
      } else {
        cpSync(src, dest, {recursive: true})
      }
    }

    applyPartPackageJson(sourceDir, configDir, tempDir)
    const identity = readPackageIdentityAt(sourceDir)
    runNpmPack(tempDir)
    moveTarballToPackageRoot(tempDir, sourceDir, identity)
  } finally {
    removePath(tempDir)
  }
}

export interface ReadmeDistOptions {
  /** Extra files copied from package root (e.g. LICENSE). */
  extraRootFiles?: string[]
}

/**
 * Packs a workspace package by copying README.md, optional extra root files, and dist/.
 * @param configDir directory containing part.package.json
 * @param options optional extra root files to copy
 */
export function runPackReadmeDist(configDir: string, options?: ReadmeDistOptions): void {
  const sourceDir = join(configDir, '..')
  const tempDir = join(configDir, 'package')
  const rootFiles = ['README.md', ...(options?.extraRootFiles ?? [])]
  checkWebpackFullySpecifiedImports(sourceDir)

  try {
    removePath(tempDir)
    mkdirSync(tempDir, {recursive: true})

    copyFileSync(join(sourceDir, packageJsonFileName), join(tempDir, packageJsonFileName))
    for (const name of rootFiles) {
      copyFileSync(join(sourceDir, name), join(tempDir, name))
    }

    const srcDist = join(sourceDir, 'dist')
    const destDist = join(tempDir, 'dist')
    cpSync(srcDist, destDist, {recursive: true})

    applyPartPackageJson(sourceDir, configDir, tempDir)
    const identity = readPackageIdentityAt(sourceDir)
    runNpmPack(tempDir)
    moveTarballToPackageRoot(tempDir, sourceDir, identity)
  } finally {
    removePath(tempDir)
  }
}

/**
 * Packs Mantine/Rsuite/Material-UI style packages: README, LICENSE, dist, and export patching.
 * @param configDir directory containing part.package.json
 */
export function runPackViewExportsPatch(configDir: string): void {
  const sourceDir = join(configDir, '..')
  const tempDir = join(configDir, 'package')
  checkWebpackFullySpecifiedImports(sourceDir)

  try {
    removePath(tempDir)
    mkdirSync(tempDir, {recursive: true})

    const filesToCopy = ['README.md', 'LICENSE', packageJsonFileName]
    for (const fileName of filesToCopy) {
      copyFileSync(join(sourceDir, fileName), join(tempDir, fileName))
    }

    cpSync(join(sourceDir, 'dist'), join(tempDir, 'dist'), {recursive: true})

    const packageJson = readJsonFile<PackageJson>(join(sourceDir, packageJsonFileName))
    const patchRaw = readJsonFile<{exports?: PackageJson['exports']} & Record<string, unknown>>(join(configDir, 'part.package.json'))
    const {exports: exportsPatch, ...patchRest} = patchRaw

    Reflect.deleteProperty(packageJson, 'scripts')
    stripPublicationDevDependencies(packageJson)
    patchExports(packageJson)
    Object.assign(packageJson, patchRest)
    if (exportsPatch && typeof exportsPatch === 'object') {
      packageJson.exports = {...packageJson.exports, ...exportsPatch}
    }

    writeFileSync(join(tempDir, packageJsonFileName), `${JSON.stringify(packageJson, undefined, 2)}\n`, 'utf8')

    runNpmPack(tempDir, 'inherit')

    const data = readPackageJson(sourceDir)
    const filename = `${data.name}-${data.version}.tgz`.replace('@', '').replace('/', '-')
    renameSync(join(tempDir, filename), join(sourceDir, filename))
  } finally {
    removePath(tempDir)
  }
}

function applyPartPackageJson(sourceDir: string, configDir: string, tempDir: string): void {
  const data = readJson<Record<string, unknown>>(join(sourceDir, packageJsonFileName))
  const patch = readJson<Record<string, unknown>>(join(configDir, 'part.package.json'))
  Reflect.deleteProperty(data, 'scripts')
  Object.assign(data, patch)
  stripPublicationDevDependencies(data)
  writeJson(join(tempDir, packageJsonFileName), data, 2)
}

/**
 * Removes monorepo-only devDependencies from a staged package.json before npm pack.
 * @param packageJson staged manifest to mutate
 */
function stripPublicationDevDependencies(packageJson: Record<string, unknown>): void {
  const devDependencies = packageJson.devDependencies
  if (!devDependencies || typeof devDependencies !== 'object') {
    return
  }

  const next = {...(devDependencies as Record<string, string>)}
  Reflect.deleteProperty(next, CLI_LIB_PACKAGE_NAME)

  if (Object.keys(next).length === 0) {
    Reflect.deleteProperty(packageJson, 'devDependencies')
    return
  }

  packageJson.devDependencies = next
}
