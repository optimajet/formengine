import type {FirstParameter} from '../types'
import type {Annotation} from '../types/annotations/Annotation'
import {ContainerAnnotation} from '../types/annotations/ContainerAnnotation'
import {AnnotationBuilder} from './builders/AnnotationBuilder'

/**
 * Type predicate, asserts that the value is an instance of ContainerAnnotation. **Internal use only.**
 * @param value the value.
 * @returns true if the value is an instance of ContainerAnnotation, false otherwise.
 */
export const isContainer = (value: Annotation): value is ContainerAnnotation => {
  return value instanceof ContainerAnnotation
}

export const createAnnotation = AnnotationBuilder.create

/**
 * Creates an instance of the builder class to define the property's metadata.
 * @param editor editor type for editing the property.
 * @returns the instance of the builder class to define the property's metadata.
 */
export function createProperty(editor: FirstParameter<typeof createAnnotation>) {
  return createAnnotation(editor).setup({annotationType: 'Property'})
}

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
