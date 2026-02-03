import type {Annotation} from '../types/annotations/Annotation'

/**
 * Extracts component properties default values from annotations . **Internal use only.**
 * @param annotations the array of component annotations.
 * @returns the object containing component properties default values.
 */
export function getDefault(annotations: Annotation[]): Readonly<Record<string, any>> {
  return annotations.reduce((props, an) => {
    props[an.key] = an.default
    return props
  }, {} as Record<string, any>)
}
