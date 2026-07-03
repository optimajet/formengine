import {dirname} from 'node:path'
import {fileURLToPath} from 'node:url'

/**
 * Resolves the directory containing the module identified by import.meta.url.
 * @param importMetaUrl import.meta.url from the caller
 */
export function dirnameFromImportMeta(importMetaUrl: string): string {
  return dirname(fileURLToPath(importMetaUrl))
}

/**
 * Resolves the directory of the entry script from process.argv[1].
 */
export function dirnameFromArgvScript(): string {
  const scriptPath = process.argv[1]
  if (!scriptPath) {
    throw new Error('Cannot determine the script directory from argv.')
  }
  return dirname(scriptPath)
}
