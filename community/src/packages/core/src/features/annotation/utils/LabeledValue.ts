import {isObject, upperFirst} from '../../../utils/tools'

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
export const toLabeledValues = (items: Array<string | number | LabeledValue>, upper = true): LabeledValue[] =>
  items.map(item => {
    if (isObject(item)) return {value: item.value as string | number, label: item.label as string | undefined}
    const value = item as string | number
    const label = upper ? upperFirst(String(item)) : String(item)
    return {value, label}
  })
