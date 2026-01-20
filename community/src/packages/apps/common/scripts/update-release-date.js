import {readFileSync, writeFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'
import packageJson from '../package.json' with {type: 'json'}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const configFilePath = join(__dirname, '..', 'src', 'utils', 'config.json')

const content = readFileSync(configFilePath, 'utf8')
const config = JSON.parse(content)

const designerPackageJsonVersion = packageJson.dependencies?.['@react-form-builder/designer'] ?? ''
const designerVersion = designerPackageJsonVersion.replace('^', '')

config.releaseDate = new Date().getTime()
config.version = designerVersion ? `v${designerVersion}` : ''
const modifiedContent = JSON.stringify(config, undefined, 2) + '\n'
writeFileSync(configFilePath, modifiedContent)
