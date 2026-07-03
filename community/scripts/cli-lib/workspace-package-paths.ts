import {existsSync, readdirSync, statSync} from 'node:fs'
import {join, relative} from 'node:path'

import {findAllPackageJsonDirectoriesUnderRelativeDirs} from './workspace-packages.ts'

/**
 * Collects repo-relative POSIX paths to packages under packages that have package.json.
 * Mirrors workspace layout: packages/*, packages/apps/*, packages/views/*.
 * @param repoRoot repository root
 */
export function collectPackagePaths(repoRoot: string): string[] {
  const packagesRoot = join(repoRoot, 'packages')
  const out: string[] = []

  const pushIfPackage = (absDir: string) => {
    if (existsSync(join(absDir, 'package.json'))) {
      out.push(relative(repoRoot, absDir).replace(/\\/g, '/'))
    }
  }

  if (!existsSync(packagesRoot)) {
    return out
  }

  for (const name of readdirSync(packagesRoot)) {
    const abs = join(packagesRoot, name)
    if (!statSync(abs).isDirectory()) {
      continue
    }
    if (name === 'apps') {
      const appsRoot = abs
      for (const app of readdirSync(appsRoot)) {
        const appAbs = join(appsRoot, app)
        if (statSync(appAbs).isDirectory()) {
          pushIfPackage(appAbs)
        }
      }
      continue
    }
    if (name === 'views') {
      const viewsRoot = abs
      for (const view of readdirSync(viewsRoot)) {
        const viewAbs = join(viewsRoot, view)
        if (statSync(viewAbs).isDirectory()) {
          pushIfPackage(viewAbs)
        }
      }
      continue
    }
    pushIfPackage(abs)
  }

  return out.sort()
}

const EXAMPLES_VERSION_ROOTS = ['examples/community', 'examples/premium'] as const

/**
 * Repo-relative POSIX paths to every package.json under examples/community and examples/premium
 * (including nested apps such as bundle-size/formengine).
 * @param repoRoot repository root
 */
export function collectExamplesVersionTargetPaths(repoRoot: string): string[] {
  const absDirs = findAllPackageJsonDirectoriesUnderRelativeDirs(repoRoot, [...EXAMPLES_VERSION_ROOTS])
  const relativePaths = absDirs.map(abs => relative(repoRoot, abs).replace(/\\/g, '/'))
  return [...new Set(relativePaths)].sort()
}

/**
 * Full list of package.json trees to patch for internal @react-form-builder/* versions.
 * @param repoRoot repository root
 */
export function allVersionTargetPaths(repoRoot: string): string[] {
  const fromPackages = collectPackagePaths(repoRoot)
  const fromExamples = collectExamplesVersionTargetPaths(repoRoot)
  const merged = [...new Set([...fromPackages, ...fromExamples])]
  return merged.sort()
}
