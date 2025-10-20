import {isNull} from '../../../utils/tools'
import type {ArgumentValue, FunctionArgumentValue} from '../types'

const fnArgumentFunctionCache = new Map<string, Function>()

/**
 * Creates an argument function from its source with caching.
 * @param source the function source.
 * @returns the executable function.
 */
export function getArgumentFunction(source: string) {
  const fn = fnArgumentFunctionCache.get(source)
  if (fn) return fn

  const result = new Function('e', 'args', '...userArgs', `return (async function(){
${source}
  })()`)
  fnArgumentFunctionCache.set(source, result)
  return result
}

/**
 * Checks whether the value of the argument is a functional type.
 * @param value the argument value.
 * @returns boolean true, if the value of the argument is a functional type, false otherwise.
 */
export const isFunctionArgumentValue = (value: ArgumentValue): value is FunctionArgumentValue => {
  return typeof value === 'object'
    && !isNull(value)
    && 'type' in value
    && value.type === 'fn'
}
