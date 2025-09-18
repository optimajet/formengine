import {useMemo} from 'react'
import {useBuilderMode} from './contexts/BuilderModeContext'

const isEmptyString = (value: string) => {
  return value.trim() === ''
}

/**
 * Returns the value to use in the builder mode.
 * @param value the value.
 * @param builderValue the value to be used if the value is not defined is an empty string or a string containing only spaces.
 * @returns the value to use in the builder mode.
 */
export const useBuilderValue = <T, >(value: T, builderValue: T): T => {
  const mode = useBuilderMode()

  return useMemo(() => {
    if (mode === 'viewer') return value

    if (typeof value === 'string' && isEmptyString(value)) return builderValue
    return value ?? builderValue
  }, [builderValue, mode, value])
}
