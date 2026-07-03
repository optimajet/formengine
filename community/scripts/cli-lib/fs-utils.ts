import {existsSync, rmSync} from 'node:fs'

/**
 * Removes a file or directory if it exists.
 * @param targetPath path to remove
 */
export function removePath(targetPath: string): void {
  if (existsSync(targetPath)) {
    rmSync(targetPath, {recursive: true, force: true})
  }
}
