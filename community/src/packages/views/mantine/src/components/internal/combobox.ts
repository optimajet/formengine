import {array, boolean, event, number, string, toLabeledValues} from '@react-form-builder/core'
import {baseInputProps} from './baseInputProps'
import type {IOption} from './IOption'

/**
 * Base combobox props for Mantine components.
 */
export const baseComboboxProps = {
  ...baseInputProps,
  clearable: boolean.default(true),
  searchValue: string,
  onSearchChange: event,
  nothingFoundMessage: string,
  dropdownOpened: boolean,
  onDropdownOpen: event,
  onDropdownClose: event,
  maxDropdownHeight: number,
  withScrollArea: boolean.default(true),
  readOnly: boolean.default(false),
  data: array.default(toLabeledValues(['Option 1', 'Option 2', 'Option 3'])),
}

/**
 * Common props for dropdown components.
 */
export interface BaseComboboxProps {
  /**
   * input label.
   */
  label?: string
  /**
   * input description.
   */
  description?: string
  /**
   * controls component size.
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * controls component appearance.
   */
  variant?: 'filled' | 'default' | 'unstyled'
  /**
   * disables the input and prevents interactions.
   */
  disabled?: boolean
  /**
   * current value of the component.
   */
  value?: string | string[] | null
  /**
   * called when the value changes.
   */
  onChange?: (...args: unknown[]) => void
  /**
   * shows a clear button when the component has a value.
   */
  clearable?: boolean
  /**
   * enables filtering options by user input.
   */
  searchable?: boolean
  /**
   * controlled search input value.
   */
  searchValue?: string
  /**
   * called when the search value changes.
   */
  onSearchChange?: (value: string) => void
  /**
   * message displayed when there are no matching options.
   */
  nothingFoundMessage?: string
  /**
   * controls dropdown opened state.
   */
  dropdownOpened?: boolean
  /**
   * called when the dropdown opens.
   */
  onDropdownOpen?: () => void
  /**
   * called when the dropdown closes.
   */
  onDropdownClose?: () => void
  /**
   * maximum dropdown height in pixels.
   */
  maxDropdownHeight?: number
  /**
   * enables scroll area for the dropdown.
   */
  withScrollArea?: boolean
  /**
   * makes the input read-only.
   */
  readOnly?: boolean
  /**
   * data used to render options.
   */
  data?: IOption[]
}
