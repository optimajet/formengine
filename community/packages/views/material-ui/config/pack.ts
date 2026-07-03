#!/usr/bin/env node

import {runPackViewExportsPatch} from '@react-form-builder/cli-lib/pack-workflow'
import {dirname} from 'node:path'
import {fileURLToPath} from 'node:url'

async function main(): Promise<void> {
  const configDir = dirname(fileURLToPath(import.meta.url))
  runPackViewExportsPatch(configDir)
}

try {
  await main()
} catch (error) {
  console.error('❌ pack script failed.', error)
  process.exitCode = 1
}
