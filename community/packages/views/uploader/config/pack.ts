#!/usr/bin/env node

import {dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {runPackReadmeDist} from '@react-form-builder/cli-lib/pack-workflow'

async function main(): Promise<void> {
  const configDir = dirname(fileURLToPath(import.meta.url))
  runPackReadmeDist(configDir, {extraRootFiles: ['LICENSE']})
}

try {
  await main()
} catch (error) {
  console.error('❌ pack script failed.', error)
  process.exitCode = 1
}
