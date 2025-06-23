import {useComponentData} from '@react-form-builder/core'
import {useCallback} from 'react'

/**
 * A function that accepts arguments and returns void.
 */
export type GenericVoidFunction = (...args: any[]) => void

/**
 * Creates a wrapper for a function from the component properties that sets the touched flag for the field.
 * @param props the component properties.
 * @param propertyName the property name containing a function.
 * @template T the component property type.
 * @returns the wrapped function.
 */
export const useTouchOnEvent = <T>(props: T, propertyName: keyof T): GenericVoidFunction => {
  const {field} = useComponentData()
  const eventCallback = props[propertyName] as GenericVoidFunction | undefined

  return useCallback((e) => {
    field?.setTouched()
    eventCallback?.(e)
  }, [field, eventCallback])
}
