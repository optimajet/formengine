import {writeFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import type {CompletedConfig} from 'ts-json-schema-generator'
import {createFormatter, createParser, createProgram, SchemaGenerator} from 'ts-json-schema-generator'
import {postProcessSchema, verifySchema} from './post-processor'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const generateJsonSchema = (outputPath: string) => {
  const config = {
    path: join(__dirname, '..', '..', 'src', 'index.ts'),
    tsconfig: join(__dirname, 'tsconfig-json-schema-generator.json'),
    type: 'PersistedForm',
    jsDoc: 'extended'
  } as CompletedConfig

  const formatter = createFormatter(config)

  const program = createProgram(config)
  const parser = createParser(program, config)
  const generator = new SchemaGenerator(program, parser, formatter, config)
  const schema = generator.createSchema(config.type)

  postProcessSchema(schema)
  verifySchema(schema)
  const schemaString = JSON.stringify(schema, null, 2)

  writeFileSync(outputPath, `${schemaString}\n`)
}

const outputPath = join(__dirname, '..', '..', 'public', 'schemas', 'persisted-form.schema.json')
generateJsonSchema(outputPath)
