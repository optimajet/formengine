import {execSync} from 'node:child_process'
import {existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, renameSync, rmSync, symlinkSync, writeFileSync} from 'node:fs'
import {basename, join, resolve} from 'node:path'

import {tarballFilename} from './npm-pack.ts'

interface PackageIdentity {
  name: string
  version: string
}

/**
 * Reads name and version from a package directory.
 * @param packagePath path to the workspace package root
 */
function readPackageIdentity(packagePath: string): PackageIdentity {
  const packageJsonPath = join(packagePath, 'package.json')
  if (!existsSync(packageJsonPath)) {
    throw new Error(`File '${packageJsonPath}' not found`)
  }

  const json = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {name: string; version: string}
  return {name: json.name, version: json.version}
}

/**
 * Removes a path if it exists.
 * @param path path to remove
 */
function removeIfExists(path: string): void {
  if (existsSync(path)) {
    rmSync(path, {recursive: true, force: true})
  }
}

/**
 * Ensures a local scoped package alias resolves from packagePath/node_modules.
 * @param packagePath workspace package where scripts are executed
 * @param packageName full npm package name (supports scoped names)
 * @param targetPath real directory that should be linked as the package
 */
function ensureLocalPackageAlias(packagePath: string, packageName: string, targetPath: string): void {
  if (!packageName.startsWith('@')) {
    throw new Error(`Only scoped package names are supported: ${packageName}`)
  }

  const slashIndex = packageName.indexOf('/')
  if (slashIndex <= 1) {
    throw new Error(`Invalid scoped package name: ${packageName}`)
  }

  const scope = packageName.slice(0, slashIndex)
  const name = packageName.slice(slashIndex + 1)
  const scopeDir = join(packagePath, 'node_modules', scope)
  const aliasPath = join(scopeDir, name)

  if (existsSync(aliasPath)) {
    const stat = lstatSync(aliasPath)
    if (stat.isSymbolicLink()) {
      const currentTarget = realpathSync(aliasPath)
      const expectedTarget = realpathSync(targetPath)
      if (currentTarget === expectedTarget) {
        return
      }
    }
    rmSync(aliasPath, {recursive: true, force: true})
  }

  mkdirSync(scopeDir, {recursive: true})
  symlinkSync(targetPath, aliasPath, process.platform === 'win32' ? 'junction' : 'dir')
  console.log(`🔗 Linked ${packageName} → ${targetPath}`)
}

const installedWorkspaceRoots = new Set<string>()

/**
 * Installs npm workspace dependencies required by `npm run pack` in workspace packages.
 * Runs once per workspace root per process. Skips when node_modules already exists.
 * @param workspaceRoot path to the repository workspace root
 */
function ensureWorkspaceDependenciesInstalled(workspaceRoot: string): void {
  const absoluteRoot = resolve(workspaceRoot)
  if (installedWorkspaceRoots.has(absoluteRoot)) {
    return
  }
  if (existsSync(join(absoluteRoot, 'node_modules'))) {
    console.log(`📥 Workspace dependencies already present in ${absoluteRoot} (skipping npm install).`)
    installedWorkspaceRoots.add(absoluteRoot)
    return
  }
  console.log(`📥 Installing workspace dependencies in ${absoluteRoot}...`)
  execSync('npm install', {cwd: absoluteRoot, stdio: 'inherit'})
  installedWorkspaceRoots.add(absoluteRoot)
}

/**
 * Installs npm dependencies for an app directory when node_modules is missing.
 * @param appDir directory containing package.json
 */
function ensureAppDependenciesInstalled(appDir: string): void {
  if (existsSync(join(appDir, 'node_modules'))) {
    return
  }
  const packageJsonPath = join(appDir, 'package.json')
  if (!existsSync(packageJsonPath)) {
    return
  }
  console.log(`📥 Installing app dependencies in ${appDir}...`)
  try {
    execSync('npm install --force', {cwd: appDir, stdio: 'inherit'})
  } catch (error) {
    if (!existsSync(join(appDir, 'node_modules'))) {
      throw error
    }
    console.warn('npm install reported errors, but node_modules exists; continuing.')
  }
}

/**
 * Runs npm pack in a workspace package, moves the tarball to scriptRoot, then npm installs it into appDir.
 * Uses cwd options instead of mutating global process.chdir.
 * @param appDir directory whose package.json receives the file: dependency install
 * @param packagePath workspace package to pack
 * @param scriptRoot directory where the .tgz is stored (and removed if present before pack)
 * @param workspaceCliLibPath optional path to local @react-form-builder/cli-lib
 */
export function packAndInstallLocalPackage(appDir: string, packagePath: string, scriptRoot: string, workspaceCliLibPath?: string): void {
  const packageData = readPackageIdentity(packagePath)
  const archiveBase = tarballFilename(packageData)
  const packageArchivePath = join(scriptRoot, archiveBase)

  removeIfExists(packageArchivePath)

  if (workspaceCliLibPath) {
    ensureLocalPackageAlias(packagePath, '@react-form-builder/cli-lib', workspaceCliLibPath)
    ensureWorkspaceDependenciesInstalled(resolve(workspaceCliLibPath, '../..'))
  }

  ensureAppDependenciesInstalled(appDir)

  console.log(`🧱 Packing ${packageData.name} from ${packagePath}...`)
  execSync('npm run pack', {cwd: packagePath, stdio: 'inherit'})

  const builtArchive = join(packagePath, archiveBase)
  if (!existsSync(builtArchive)) {
    throw new Error(`Package archive not found: ${builtArchive}`)
  }

  renameSync(builtArchive, packageArchivePath)

  removeIfExists(join(appDir, 'node_modules', '.cache'))

  console.log(`📦 Installing ${basename(packageArchivePath)} into ${appDir}...`)
  execSync(`npm install ${JSON.stringify(packageArchivePath)} --force`, {
    cwd: appDir,
    stdio: 'inherit',
  })
}

/**
 * Removes a dependency key from package.json dependencies if present.
 * @param appDir directory containing package.json
 * @param dependency npm package name
 */
export function removeDependencyFromPackageJson(appDir: string, dependency: string): void {
  const filename = join(appDir, 'package.json')
  if (!existsSync(filename)) {
    return
  }

  const content = JSON.parse(readFileSync(filename, 'utf8')) as {dependencies?: Record<string, string>}

  if (content.dependencies && dependency in content.dependencies) {
    delete content.dependencies[dependency]
  }

  writeFileSync(filename, `${JSON.stringify(content, null, 2)}\n`, {encoding: 'utf8'})
}
