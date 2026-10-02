#!/usr/bin/env node

import {dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {runPackManifestFiles} from '@react-form-builder/cli-lib/pack-workflow'

async function main(): Promise<void> {
  const configDir = dirname(fileURLToPath(import.meta.url))
  runPackManifestFiles(configDir, 'cp-if-exists')
}

try {
  await main()
} catch (error) {
  console.error('❌ pack script failed.', error)
  process.exitCode = 1
}
