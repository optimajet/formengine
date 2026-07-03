import type {AriaAttributes} from 'react'
import {useMemo} from 'react'
import {useComponentData} from './contexts/ComponentDataContext'

/**
 * Represents the options for ARIA attributes configurations.
 */
export type AriaAttributesOptions = {
  /**
   * Indicates whether an item, element, or entity is marked or tagged with a label.
   */
  labeled: boolean
}

/**
 * The record with 'aria' attributes.
 */
export type AriaAttributesIds = Record<
  keyof Pick<AriaAttributes, 'aria-labelledby' | 'aria-errormessage'>,
  string
>

/**
 * @param options options for configuring the generation of ARIA attributes.
 * @returns a map of aria attributes ids.
 */
export const useAriaAttributesIds = (options: AriaAttributesOptions): AriaAttributesIds => {
  const {id} = useComponentData()
  return useMemo(() => {
    const result = {} as AriaAttributesIds
    if (options.labeled) {
      result['aria-labelledby'] = `${id}-label`
    }
    result['aria-errormessage'] = `${id}-error`
    return result
  }, [id, options.labeled])
}

/**
 * @returns a record with an 'aria-errormessage' attribute.
 */
export const useAriaErrorMessage = () => {
  const {id} = useComponentData()
  return useMemo(() => ({
    'aria-errormessage': `${id}-error`
  }), [id])
}

/**
 * @returns a record with an 'aria-invalid' attribute.
 */
export const useAriaInvalid = () => {
  const {field} = useComponentData()
  const error = !!field?.error
  return useMemo(() => ({'aria-invalid': error}), [error])
}

/**
 * @param options options for configuring the generation of ARIA attributes.
 * @returns a record with 'aria' attributes.
 */
export const useAriaAttributes = (options: AriaAttributesOptions) => {
  const invalid = useAriaInvalid()
  const attributesIds = useAriaAttributesIds(options)
  return useMemo(() => {
    return {
      ...attributesIds,
      ...invalid
    }
  }, [attributesIds, invalid])
}
