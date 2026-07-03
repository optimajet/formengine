import {readFileSync, writeFileSync} from 'node:fs'

/**
 * Reads and parses JSON from a file.
 * @param filePath absolute path to the JSON file
 * @returns parsed value
 */
export function readJson<T>(filePath: string): T {
  const buffer = readFileSync(filePath, 'utf8')
  return JSON.parse(buffer) as T
}

/**
 * Writes a value as formatted JSON to a file.
 * @param filePath destination path
 * @param value value to serialize
 * @param space indentation (default 2)
 */
export function writeJson(filePath: string, value: unknown, space = 2): void {
  const body = `${JSON.stringify(value, undefined, space)}\n`
  writeFileSync(filePath, body, 'utf8')
}
