import {existsSync, readdirSync, statSync} from 'node:fs'
import {basename, dirname, join} from 'node:path'

import {readJson} from './json-fs.ts'

/**
 * A directory that contains a package.json (workspace or nested package).
 */
export interface WorkspacePackageInfo {
  /** Absolute path to the package root. */
  dir: string
  /** package.json name, or directory basename if missing. */
  name: string
}

/**
 * Expands a single npm workspace glob relative to repoRoot (e.g. packages/*).
 * @param repoRoot absolute path to the folder that contains the root package.json
 * @param pattern workspace entry from package.json (may contain *)
 */
function expandWorkspacePatternToDirs(repoRoot: string, pattern: string): string[] {
  const absolutePattern = join(repoRoot, pattern)

  if (!pattern.includes('*')) {
    return [absolutePattern]
  }

  const parent = dirname(absolutePattern)
  if (!existsSync(parent)) {
    return []
  }

  const entries = readdirSync(parent, {withFileTypes: true})
  return entries.filter(entry => entry.isDirectory()).map(entry => join(parent, entry.name))
}

/**
 * Lists workspace packages declared in root package.json under repoRoot (Lerna/npm workspaces).
 * @param repoRoot absolute path to the monorepo root (contains package.json with workspaces)
 */
export function findNpmWorkspacePackages(repoRoot: string): WorkspacePackageInfo[] {
  const rootPackageJsonPath = join(repoRoot, 'package.json')
  if (!existsSync(rootPackageJsonPath)) {
    return []
  }

  const rootPackageJson = readJson<{workspaces?: string[]}>(rootPackageJsonPath)
  const workspaces = rootPackageJson.workspaces ?? []
  const packages: WorkspacePackageInfo[] = []

  for (const pattern of workspaces) {
    const dirs = expandWorkspacePatternToDirs(repoRoot, pattern)
    for (const dir of dirs) {
      const packageJsonPath = join(dir, 'package.json')
      if (!existsSync(packageJsonPath)) {
        continue
      }

      const stat = statSync(packageJsonPath)
      if (!stat.isFile()) {
        continue
      }

      const pkg = readJson<{name?: string}>(packageJsonPath)
      const name = pkg.name ?? basename(dir)
      packages.push({dir, name})
    }
  }

  return packages
}

const defaultSkipDirNames = new Set(['node_modules'])

/**
 * Finds directories under repo-relative roots that contain package.json (nested packages, e.g. examples).
 * Does not recurse into a directory once it is treated as a package root.
 * @param repoRoot absolute repository root
 * @param relativeDirs paths relative to repoRoot (e.g. examples)
 * @param skipDirNames directory names to skip while walking
 */
export function findNestedPackageRootsUnderRelativeDirs(
  repoRoot: string,
  relativeDirs: string[],
  skipDirNames: ReadonlySet<string> = defaultSkipDirNames
): WorkspacePackageInfo[] {
  const result: WorkspacePackageInfo[] = []

  for (const relativeDir of relativeDirs) {
    const baseDir = join(repoRoot, relativeDir)
    if (!existsSync(baseDir)) {
      continue
    }

    const stack: string[] = [baseDir]

    while (stack.length > 0) {
      const currentDir = stack.pop() as string
      const entries = readdirSync(currentDir, {withFileTypes: true})

      for (const entry of entries) {
        if (!entry.isDirectory() || skipDirNames.has(entry.name)) {
          continue
        }

        const dir = join(currentDir, entry.name)
        const packageJsonPath = join(dir, 'package.json')

        if (existsSync(packageJsonPath)) {
          result.push({
            dir,
            name: entry.name,
          })
          continue
        }

        stack.push(dir)
      }
    }
  }

  return result
}

/**
 * Lists every directory under repo-relative roots that contains a package.json file,
 * including nested packages (e.g. both bundle-size and bundle-size/formengine).
 * Recursion continues inside package directories; skips skipDirNames (e.g. node_modules).
 * @param repoRoot absolute repository root
 * @param relativeDirs paths relative to repoRoot
 * @param skipDirNames directory names to skip while walking
 * @returns absolute paths to package roots (unsorted)
 */
export function findAllPackageJsonDirectoriesUnderRelativeDirs(
  repoRoot: string,
  relativeDirs: string[],
  skipDirNames: ReadonlySet<string> = defaultSkipDirNames
): string[] {
  const result: string[] = []

  const walk = (absDir: string): void => {
    if (!existsSync(absDir)) {
      return
    }
    const st = statSync(absDir)
    if (!st.isDirectory()) {
      return
    }

    const packageJsonPath = join(absDir, 'package.json')
    if (existsSync(packageJsonPath)) {
      const pjStat = statSync(packageJsonPath)
      if (pjStat.isFile()) {
        result.push(absDir)
      }
    }

    try {
      const entries = readdirSync(absDir, {withFileTypes: true})
      for (const entry of entries) {
        if (!entry.isDirectory() || skipDirNames.has(entry.name)) {
          continue
        }
        walk(join(absDir, entry.name))
      }
    } catch {
      return
    }
  }

  for (const relativeDir of relativeDirs) {
    walk(join(repoRoot, relativeDir))
  }

  return result
}
