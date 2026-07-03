import {createProperty} from './utils/createProperty'

/**
 * Annotation builder for a required property of a component with type 'boolean'.
 */
export const required = createProperty('required')
  .setup({controlsRequiredProp: true})
  .typed('boolean')
