#!/usr/bin/env node

import {dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {runCheckPack} from '@react-form-builder/cli-lib/check-pack-workflow'

try {
  runCheckPack(dirname(fileURLToPath(import.meta.url)))
} catch (error) {
  console.error('❌ check-pack script failed.', error)
  process.exitCode = 1
}
