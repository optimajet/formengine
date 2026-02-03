import {createProperty} from './utils/createProperty'

/**
 * The annotation builder for a component property with type 'enum', the property value can only be one of enum.
 */
export const oneOf = createProperty('oneOf').oneOf.bind(createProperty('oneOf'))
