import type {AriaAttributes} from 'react'
import {useMemo} from 'react'
import {useComponentData} from './contexts/ComponentDataContext'

type AriaAttributesIds = Record<
  keyof Pick<AriaAttributes, 'aria-labelledby' | 'aria-errormessage'>,
  string
>

/**
 * @returns a map of aria attributes ids.
 */
export const useAriaAttributesIds = (): AriaAttributesIds => {
  const {id} = useComponentData()
  return useMemo(() => ({
    'aria-labelledby': `${id}-label`,
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
 * @returns a record with an 'aria' attributes.
 */
export const useAriaAttributes = () => {
  const invalid = useAriaInvalid()
  const attributesIds = useAriaAttributesIds()
  return useMemo(() => {
    return {
      ...attributesIds,
      ...invalid
    }
  }, [attributesIds, invalid])
}
