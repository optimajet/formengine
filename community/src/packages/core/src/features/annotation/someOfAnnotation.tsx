import {createProperty} from './utils/createProperty'

/**
 * The annotation builder for a component property with type 'enum', the property value can contain multiple enum values.
 */
export const someOf = createProperty('someOf').someOf.bind(createProperty('someOf'))
