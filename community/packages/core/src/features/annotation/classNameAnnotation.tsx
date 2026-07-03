import {createProperty} from './utils/createProperty'

/**
 * The annotation builder for the component property containing the CSS class name.
 */
export const className = createProperty('string')
  .calculable(true)
  .build('className')
