import {createProperty} from './utils/createProperty'

/**
 * The annotation builder for a component property with type 'color' (e.g. rgba(71, 167, 122, 0.72)).
 */
export const color = createProperty('color').typed('string')
