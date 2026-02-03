import {createProperty} from './utils/createProperty'

/**
 * The annotation builder for a component property with type 'object'. It can accommodate any nested POJO that contains primitive values.
 */
export const object = createProperty('object').typed('object')
