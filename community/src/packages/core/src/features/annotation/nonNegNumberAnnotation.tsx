import {number} from './numberAnnotation'

/**
 * The annotation builder for a component property with type 'number' that cannot be negative.
 */
export const nonNegNumber = number.withEditorProps({min: 0})
