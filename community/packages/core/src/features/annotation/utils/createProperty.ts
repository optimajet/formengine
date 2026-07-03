import type {FirstParameter} from '../types/FirstParameter'
import {createAnnotation} from './createAnnotation'

/**
 * Creates an instance of the builder class to define the property's metadata.
 * @param editor editor type for editing the property.
 * @returns the instance of the builder class to define the property's metadata.
 */
export function createProperty(editor: FirstParameter<typeof createAnnotation>) {
  return createAnnotation(editor).setup({annotationType: 'Property'})
}
