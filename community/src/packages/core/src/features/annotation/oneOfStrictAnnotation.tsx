import {createProperty} from './utils/createProperty'

/**
 * The annotation builder for a component property with type 'enum', the property value can only be one of enum.
 * New values cannot be created (non-creatable).
 */
export const oneOfStrict = createProperty('oneOf').oneOf.bind(createProperty('oneOf').withEditorProps({creatable: false}))
