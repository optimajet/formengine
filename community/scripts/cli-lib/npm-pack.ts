import {execSync} from 'node:child_process'
import {renameSync} from 'node:fs'
import {join} from 'node:path'

interface PackageIdentity {
  name: string
  version: string
}

/**
 * Builds the npm tarball filename for a package (scoped names normalized).
 * @param pkg name and version from package.json
 */
export function tarballFilename(pkg: PackageIdentity): string {
  return `${pkg.name}-${pkg.version}.tgz`.replace('@', '').replace('/', '-')
}

/**
 * Runs npm pack in the given directory (usually a staging folder).
 * @param cwd working directory for npm pack
 * @param stdio stdio option for child process
 */
export function runNpmPack(cwd: string, stdio: 'inherit' | 'pipe' = 'inherit'): void {
  execSync('npm pack', {cwd, stdio})
}

/**
 * Moves the generated tarball from the staging directory to the package source root.
 * @param stagingDir directory where npm pack wrote the .tgz
 * @param sourceDir package root (destination for the .tgz)
 * @param pkg identity read from the workspace package.json (for the tarball basename)
 */
export function moveTarballToPackageRoot(stagingDir: string, sourceDir: string, pkg: PackageIdentity): void {
  const filename = tarballFilename(pkg)
  renameSync(join(stagingDir, filename), join(sourceDir, filename))
}
