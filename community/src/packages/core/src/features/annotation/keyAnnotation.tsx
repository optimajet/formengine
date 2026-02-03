import {createAnnotation} from './utils/createAnnotation'
import {isUniqueKey} from './utils/isUniqueKey'

/**
 * The annotation for the 'key' property of the component.
 */
export const key = createAnnotation('key')
  .typed('string')
  .required
  .hinted('Unique component key')
  .calculable(false)
  .validated(isUniqueKey, {code: 'unique_key', message: 'The key must be unique!'})
  .build('key')
