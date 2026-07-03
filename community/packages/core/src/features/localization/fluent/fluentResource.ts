import {isString} from '../../../utils/isString'
import {replaceDotsDeep} from './dots'

const escapeCurlyBraces = (value: string): string => {
  return value.replaceAll('{', '{"{"}').replaceAll('}', '{"}"}')
}

/**
 * Encodes a localization constant value for Fluent resource syntax.
 * @param value localization constant.
 * @returns encoded fluent value text.
 */
export const fluentEncodeValue = (value: unknown): string => {
  const string = isString(value)
  const raw = string ? value : JSON.stringify(value)
  const escaped = string ? raw : escapeCurlyBraces(raw)
  const lines = escaped.split('\n')

  if (lines.length <= 1) return lines[0] ?? ''

  const [first, ...rest] = lines

  // https://projectfluent.org/fluent/guide/syntax.html#multiline-text
  return [
    first ?? '',
    ...rest.map((line) => `    ${line}`),
  ].join('\n')
}

/**
 * Converts a record of messages to Fluent resource source text.
 * @param messages message id to value map.
 * @returns fluent resource source.
 */
export const objectToFluentResource = (messages: Record<string, unknown>): string =>
  Object.entries(messages)
    .map(([key, value]) => `${key} = ${fluentEncodeValue(replaceDotsDeep(value))}`)
    .join('\n')
