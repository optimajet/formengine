import type {Annotation} from '../types/annotations/Annotation'
import {ContainerAnnotation} from '../types/annotations/ContainerAnnotation'

/**
 * Type predicate, asserts that the value is an instance of ContainerAnnotation. **Internal use only.**
 * @param value the value.
 * @returns true if the value is an instance of ContainerAnnotation, false otherwise.
 */
export const isContainer = (value: Annotation): value is ContainerAnnotation => {
  return value instanceof ContainerAnnotation
}
