import {isNull, isObject, isUndefined} from '../../../utils/tools'
import type {SchemaType} from '../types/SchemaType'

const same = (from: any) => from

const error = (from: any) => {
  throw new Error(`Cannot convert from '${from}'`)
}

const parse = (from: any) => JSON.parse(from)

const parseOrSource = (from: any) => {
  try {
    const parsed = JSON.parse(from)
    return isObject(parsed) ? parsed : from
  } catch (e) {
    console.warn(e)
    return from
  }
}

const stringify = (from: any) => JSON.stringify(from)

const toString = (from: any) => from.toString()

const ifInstanceThenSame = (constructor: any) => {
  return (from: any) => from instanceof constructor ? from : error(from)
}
const toNumber = (from: any) => {
  if (from === '') return undefined
  const result = Number(from)
  if (isNaN(result)) error(from)
  return result
}

const toDate = (from: any) => new Date(from)

const formatTimePart = (part: number) => part > 9 ? `${part}` : `0${part}`

const toTime = (from: Date) => {
  const hours = formatTimePart(from.getHours())
  const minutes = formatTimePart(from.getMinutes())
  const seconds = formatTimePart(from.getSeconds())
  return `${hours}:${minutes}:${seconds}`
}

const converters: Record<SchemaType, Record<SchemaType, (from: any) => any>> = {
  'string': {
    'string': same,
    'number': toNumber,
    'boolean': (from: string) => from === 'true',
    'object': parseOrSource,
    'array': parse,
    'enum': same,
    'date': toDate,
    'time': same
  },
  'number': {
    'string': toString,
    'number': same,
    'boolean': (from: number) => from === 1,
    'object': parseOrSource,
    'array': error,
    'enum': same,
    'date': toDate,
    'time': toString
  },
  'boolean': {
    'string': toString,
    'number': (from: boolean) => from ? 1 : 0,
    'boolean': same,
    'object': error,
    'array': error,
    'enum': same,
    'date': error,
    'time': error
  },
  'object': {
    'string': stringify,
    'number': error,
    'boolean': error,
    'object': same,
    'array': error,
    'enum': same,
    'date': error,
    'time': error
  },
  'array': {
    'string': stringify,
    'number': error,
    'boolean': error,
    'object': error,
    'array': same,
    'enum': same,
    'date': error,
    'time': error
  },
  'enum': {
    'string': stringify,
    'number': ifInstanceThenSame(Number),
    'boolean': ifInstanceThenSame(Boolean),
    'object': ifInstanceThenSame(Object),
    'array': ifInstanceThenSame(Array),
    'enum': same,
    'date': ifInstanceThenSame(Date),
    'time': stringify,
  },
  'date': {
    'string': toString,
    'number': (from: Date) => from.getTime(),
    'boolean': error,
    'object': error,
    'array': error,
    'enum': same,
    'date': same,
    'time': toTime
  },
  'time': {
    'string': same,
    'number': error,
    'boolean': error,
    'object': error,
    'array': error,
    'enum': same,
    'date': error,
    'time': same
  },
}

const getValueType = (value: unknown): SchemaType => {
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  if (value instanceof Date) return 'date'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  return 'enum'
}

/**
 * Converts a value from one type to another.
 * @param from the value to convert.
 * @param toType the type to convert to.
 * @returns the converted value.
 */
export const autoConvertField = (from: any, toType: SchemaType): unknown => {
  if (isNull(from) || isUndefined(from)) return undefined

  const fromType = getValueType(from)
  const converter = converters[fromType]?.[toType]
  if (!converter) throw new Error(`Cannot convert ${from} from '${fromType}' to '${toType}'`)
  try {
    return converter(from)
  } catch (e) {
    throw new Error(`Cannot convert ${from} from '${fromType}' to '${toType}'. ${e}.`)
  }
}
