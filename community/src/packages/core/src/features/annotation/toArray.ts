import {isUndefined} from '../../utils/tools'
import {string} from './index'
import type {Annotation} from './types/annotations/Annotation'
import type {Annotations} from './utils/builders/Annotations'
import type {BuilderSetup} from './utils/builders/BaseBuilder'

/**
 * Converts the object containing component property metadata into an array. **Internal use only.**
 * @param annotations the object containing component property metadata.
 * @param setup the custom options for the component's property metadata builder.
 * @returns the metadata array of the component properties.
 */
export function toArray<T extends object = any>(annotations?: Annotations<T>, setup: BuilderSetup = {}) {
  const result: Annotation[] = []
  if (isUndefined(annotations)) return result

  for (const key of Object.keys(annotations)) {
    const value = (annotations as any)[key]
    const built = value?.setup(setup)?.build(key) ?? string.setup(setup).build(key)

    result.push(built)
  }

  return result
}
