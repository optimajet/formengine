import {toArray} from './toArray'
import type {Annotations} from './utils/builders/Annotations'

/**
 * Converts the object containing component property metadata into an array of style properties. **Internal use only.**
 * @param annotations the object containing component property metadata.
 * @returns the object containing component properties default values.
 */
export function toStyleProperties(annotations?: Annotations<any>) {
  return toArray(annotations, {annotationType: 'Style', calculable: false})
}
