import {isObject, upperFirst} from 'lodash-es'

/**
 * The element with the value and the label.
 */
export interface LabeledValue {
  /**
   * The value.
   */
  value: string | number;
  /**
   * The label.
   */
  label?: string;
}

/**
 * Converts the array of elements into the array of {@link LabeledValue} elements.
 * @param items the array of elements.
 * @param upper if true, the first character in {@link LabeledValue.label} will be capitalized.
 * @returns the array of {@link LabeledValue} elements.
 */
export const toLabeledValues = (items: string[] | LabeledValue[], upper = true) =>
  items.map(item => ({
    value: isObject(item) ? item.value : item,
    label: isObject(item)
      ? item.label
      : (upper ? upperFirst(item) : item)
  }))
