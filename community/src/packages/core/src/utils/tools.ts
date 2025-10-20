/**
 * Returns true if value is strictly undefined.
 * @param value the input value.
 * @returns boolean indicating undefined.
 */
export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined'
}

/**
 * Returns true if value is strictly null.
 * @param value the input value.
 * @returns boolean indicating null.
 */
export function isNull(value: unknown): value is null {
  return value === null
}

/**
 * Returns true if value is a number (NaN and Infinity included).
 * @param value input value.
 * @returns boolean indicating number.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

/**
 * Type guard: true if value is a non-null object.
 * @param value input value.
 * @returns boolean indicating object.
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object'
}

/**
 * Generic emptiness check for strings, arrays, maps/sets and objects.
 * @param value input value.
 * @returns true if considered empty.
 */
export function isEmpty(value: unknown): boolean {
  if (isNull(value) || isUndefined(value)) return true
  if (typeof value === 'string') return value.length === 0
  if (Array.isArray(value)) return value.length === 0
  if (value instanceof Map || value instanceof Set) return value.size === 0
  if (isObject(value)) return Object.keys(value).length === 0
  return false
}

function splitFirstGrapheme(input: string): [string, string] {
  if (!input) return ['', '']
  try {
    // @ts-ignore Segmenter may not be available
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      // @ts-ignore Segmenter may not be available
      const seg = new Intl.Segmenter(undefined, {granularity: 'grapheme'})
      const it = seg.segment(input)[Symbol.iterator]()
      const n = it.next()
      if (!n.done) {
        const first = String(n.value.segment)
        return [first, input.slice(first.length)]
      }
      return ['', '']
    }
  } catch {
    // ignore
  }
  const arr = [...input]
  return [arr[0] ?? '', arr.slice(1).join('')]
}

function upperFirstUnicode(input: string): string {
  if (!input) return ''
  const [first, rest] = splitFirstGrapheme(input)
  return first.toUpperCase() + rest
}

function tokenizeWordsUnicode(input: string): string[] {
  const s = String(input ?? '')
  if (!s) return []
  const pre = s.replace(/(\p{Ll})(\p{Lu})/gu, '$1 $2')
  try {
    // @ts-ignore Segmenter may not be available
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      // @ts-ignore Segmenter may not be available
      const seg = new Intl.Segmenter(undefined, {granularity: 'word'})
      const out: string[] = []
      for (const part of seg.segment(pre)) {
        const p: any = part
        const chunk = String(p.segment)
        const isWord: boolean = (p.isWordLike ?? /[\p{L}\p{N}]/u.test(chunk)) as boolean
        if (isWord) out.push(chunk)
      }
      return out
    }
  } catch {
    // ignore
  }
  return pre
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
}

/**
 * Convert a string to camelCase.
 * @param input the input string.
 * @returns the camelCased string.
 */
export function camelCase(input: string): string {
  const words = tokenizeWordsUnicode(input)
  if (words.length === 0) return ''
  const first = words[0].toLowerCase()
  const rest = words.slice(1).map(w => upperFirstUnicode(w.toLowerCase()))
  return [first, ...rest].join('')
}

/**
 * Uppercase the first character of a string.
 * @param input input string.
 * @returns string with first char uppercased.
 */
export function upperFirst(input: string): string {
  return upperFirstUnicode(input)
}

/**
 * Convert a string to Start Case.
 * @param input the input string.
 * @returns the start-cased string.
 */
export function startCase(input: string): string {
  const words = tokenizeWordsUnicode(input)
  if (words.length === 0) return ''
  return words.map(w => upperFirstUnicode(w.toLowerCase())).join(' ')
}

/**
 * Uppercase wrapper guarding falsy input.
 * @param input the input string.
 * @returns the uppercased string.
 */
export function toUpper(input: string): string {
  return (input || '').toUpperCase()
}

/**
 * Create an incrementing unique id string with optional prefix.
 * @param prefix the optional prefix.
 * @returns the unique id string.
 */
export function uniqueId(prefix = ''): string {
  return `${prefix}${++uniqueId.counter}`
}

uniqueId.counter = 0

/**
 * Deep merge plain objects left-to-right.
 * @param target the target object.
 * @param sources the additional sources.
 * @returns the merged target.
 */
export function merge<T extends object>(target: T, ...sources: any[]): T {
  for (const source of sources) {
    if (!isObject(target) || !isObject(source)) {
      Object.assign(target, source)
      continue
    }
    for (const key of Object.keys(source)) {
      const sVal = (source as any)[key]
      const tVal = (target as any)[key]
      if (isObject(sVal) && isObject(tVal)) {
        merge(tVal, sVal)
      } else {
        (target as any)[key] = sVal
      }
    }
  }
  return target
}

/**
 * Debounce function calls with a timeout.
 * @param fn the function to debounce.
 * @param wait the delay in ms.
 * @returns the debounced function.
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, wait = 0) {
  let timer: ReturnType<typeof setTimeout> | undefined = undefined
  const debounced = (...args: Parameters<T>) => {
    if (!isUndefined(timer)) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
  return debounced as (...args: Parameters<T>) => ReturnType<T> | void
}

/**
 * Naive deep equality via JSON serialization.
 * @param a the first value.
 * @param b the second value.
 * @returns the equality result.
 */
export function isEqual<T>(a: T, b: T): boolean {
  if (a === b) return true

  if (a == null || b == null) return false

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false
    }
    return true
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a) as (keyof T)[]
    const bKeys = Object.keys(b) as (keyof T)[]
    if (aKeys.length !== bKeys.length) return false

    for (const key of aKeys) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false
      if (!isEqual(a[key], b[key])) return false
    }
    return true
  }

  return false
}

/**
 * Deep equality with optional customizer short-circuiting element-wise.
 * @param a the first value.
 * @param b the second value.
 * @param customizer the optional comparator callback.
 * @returns the equality result.
 */
export function isEqualWith(
  a: unknown,
  b: unknown,
  customizer?: (a: any, b: any, key?: any) => boolean | undefined
): boolean {
  if (customizer) {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) {
        const c = customizer(a[i], b[i], i)
        if (!isUndefined(c)) {
          if (!c) return false
          continue
        }
        if (!isEqualWith(a[i], b[i], customizer)) return false
      }
      return true
    }
    if (isObject(a) && isObject(b)) {
      const keys = new Set([...Object.keys(a), ...Object.keys(b)])
      for (const key of keys) {
        const c = customizer((a as any)[key], (b as any)[key], key)
        if (!isUndefined(c)) {
          if (!c) return false
          continue
        }
        if (!isEqualWith((a as any)[key], (b as any)[key], customizer)) return false
      }
      return true
    }
  }
  return isEqual(a, b)
}

/**
 * Creates a deep cloned copy of the provided value.
 * - Preserves prototypes for objects and class instances.
 * - Copies Maps, Sets, Dates, RegExps, ArrayBuffers/TypedArrays.
 * - Handles circular references via an internal WeakMap.
 * @param value the value to deep-clone.
 * @param weakMap internal map to track circular references (do not pass in normal use).
 * @returns a deep-cloned value structurally equal to the input.
 */
export function cloneDeep<T>(value: T, weakMap = new WeakMap()): T {
  // Handle primitives
  if (value === null || typeof value !== 'object') {
    return value
  }

  // Handle circular references
  if (weakMap.has(value as object)) {
    return weakMap.get(value as object)
  }

  // Handle Date
  if (value instanceof Date) {
    return new Date(value.getTime()) as T
  }

  // Handle RegExp
  if (value instanceof RegExp) {
    const re = new RegExp(value.source, value.flags)
    re.lastIndex = value.lastIndex
    return re as T
  }

  // Handle Map
  if (value instanceof Map) {
    const result = new Map()
    weakMap.set(value, result)
    value.forEach((v, k) => {
      result.set(cloneDeep(k, weakMap), cloneDeep(v, weakMap))
    })
    return result as T
  }

  // Handle Set
  if (value instanceof Set) {
    const result = new Set()
    weakMap.set(value, result)
    value.forEach(v => result.add(cloneDeep(v, weakMap)))
    return result as T
  }

  // Handle ArrayBuffer / TypedArray
  if (ArrayBuffer.isView(value)) {
    return new (value.constructor as any)(value) as T
  }
  if (value instanceof ArrayBuffer) {
    // eslint-disable-next-line unicorn/prefer-spread
    return value.slice(0) as T
  }

  // Handle Array
  if (Array.isArray(value)) {
    const result: any[] = []
    weakMap.set(value, result)
    for (const item of value) {
      result.push(cloneDeep(item, weakMap))
    }
    return result as T
  }

  // Handle plain object or class instance
  const proto = Object.getPrototypeOf(value)
  const result = Object.create(proto)
  weakMap.set(value, result)

  for (const key of Reflect.ownKeys(value)) {
    const desc = Object.getOwnPropertyDescriptor(value, key)
    if (desc) {
      if ('value' in desc) {
        desc.value = cloneDeep((value as any)[key], weakMap)
      }
      Object.defineProperty(result, key, desc)
    }
  }

  return result as T
}
