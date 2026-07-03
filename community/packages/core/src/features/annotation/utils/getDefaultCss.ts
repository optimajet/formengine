import type {Annotation} from '../types/annotations/Annotation'
import {getDefault} from './getDefault'

/**
 * Extracts CSS properties default values from annotations . **Internal use only.**
 * @param annotations the array of component annotations.
 * @returns the object with CSS properties default values.
 */
export function getDefaultCss(annotations: Annotation[]): Readonly<Record<string, any>> {
  return ({
    any: {
      object: getDefault(annotations)
    }
  })
}
