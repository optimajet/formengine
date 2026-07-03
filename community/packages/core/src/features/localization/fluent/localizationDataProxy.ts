import {restoreDots} from './dots'

/**
 * Memorizes undefined data variables and replaces them with empty string.
 * @param localizationData key-val localization data.
 * @param missingProperties array to memoize undefined variables names.
 * @returns proxy for data record.
 */
export function createLocalizationDataProxy(
  localizationData: Record<string, unknown>,
  missingProperties: string[],
): Record<string, unknown> {
  return new Proxy(localizationData, {
    get(target, property: string) {
      if (property in target) {
        return target[property]
      }
      missingProperties.push(restoreDots(property))
      return ''
    },
    getOwnPropertyDescriptor(target, property) {
      if (property in target) {
        return Reflect.getOwnPropertyDescriptor(target, property)
      }
      return {
        value: '',
        writable: true,
        configurable: true,
      }
    },
  })
}
