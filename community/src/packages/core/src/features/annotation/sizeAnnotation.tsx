import {createProperty} from './utils/createProperty'

/**
 * The annotation builder for a component property with type 'CSS unit' (width, height, etc.).
 */
export const size = createProperty('size').typed('string')
