import type {Context, Provider} from 'react'
import {createContext, useContext} from 'react'

function createContextHook<T, >(context: Context<T>) {
  return () => {
    const value = useContext(context)

    if (!value) throw new Error(`The context ${context.displayName} was not found!`)

    return value
  }
}

function createProvider<T, >(context: Context<T | null>) {
  const value = context as Context<T>
  return value.Provider
}

/**
 * Creates non-nullable React context. **Internal use only.**
 * @param name the context name.
 * @param defaultValue the optional default value.
 * @returns the tuple [hook, provider, and common context] for interactions with a non-nullable context.
 */
export function createNonNullableContext<T>(name: string, defaultValue: T | null = null): [() => T, Provider<T>, Context<T | null>] {
  const context = createContext<T | null>(defaultValue)
  context.displayName = name

  const hook = createContextHook(context)
  const provider = createProvider(context)

  return [hook, provider, context]
}
