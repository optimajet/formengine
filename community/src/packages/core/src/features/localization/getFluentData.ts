import type {FluentVariable} from '@fluent/bundle/esm/bundle'
import {isNull} from '../../utils/tools'
import {dotInternalValue} from './dots'
import {getFluentCompatibleId} from './getFluentCompatibleId'
import {isFluentVariable} from './isFluentVariable'

/**
 * Converts the form data to a Fluent compatible. **Internal use only.**
 * @param data the form data.
 * @param parentKey the parent property key.
 * @returns all the form data that is of the FluentVariable type.
 * Additionally, the keys of the returned object are converted to the snake case.
 */
export const getFluentData = (data: Record<string, unknown>, parentKey = ''): Record<string, FluentVariable> => {
  const fluentData: Record<string, FluentVariable> = {}
  for (const [key, value] of Object.entries(data)) {
    const newKey = parentKey ? `${parentKey}${dotInternalValue}${key}` : key
    if (isFluentVariable(value)) {
      fluentData[getFluentCompatibleId(newKey)] = value
    } else if (typeof value === 'boolean') {
      fluentData[getFluentCompatibleId(newKey)] = value ? 'true' : 'false'
    } else if (typeof value === 'object' && !isNull(value)) {
      Object.assign(fluentData, getFluentData(value as Record<string, unknown>, newKey))
    }
  }
  return fluentData
}
