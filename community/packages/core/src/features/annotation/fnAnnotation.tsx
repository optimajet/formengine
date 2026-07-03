import {createProperty} from './utils/createProperty'

/**
 * The annotation builder for a component property with type 'function'.
 * @param fnDescriptionBegin the beginning of function description.
 * @param fnDescriptionEnd the ending  of function description.
 * @returns the annotation builder for a component property with type 'function'.
 * @example
 * ```ts
 * // Example usage with TSDoc-style function description:
 * fn(
 *   `/**
 *     * @param {string} value
 *     * @param {ItemDataType} item
 *     * @return {boolean}
 *     *\/
 *   function filterBy(value, item) {`
 * )
 * ```
 * This will create a function property with proper type hints and documentation
 * that describes a filter function taking a string and an item, returning a boolean.
 */
export const fn = (fnDescriptionBegin: string, fnDescriptionEnd = '}') => {
  return createProperty('function')
    .typed('string')
    .calculable(false)
    .withEditorProps({
      beginContextLine: fnDescriptionBegin,
      endContextLine: fnDescriptionEnd,
    })
}
