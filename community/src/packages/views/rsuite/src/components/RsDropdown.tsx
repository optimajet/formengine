import {array, boolean, define, string, toLabeledValues} from '@react-form-builder/core'
import type {ReactNode} from 'react'
import {useCallback} from 'react'
import type {InputPickerProps} from 'rsuite'
import {InputPicker} from 'rsuite'
import {pickerProps} from '../commonProperties'
import type {LoadDataProps} from '../hooks'
import {useFixAriaAttributesForInputPicker, useLoadData} from '../hooks'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'
import {useTouchOnEvent} from './hooks/useTouchOnEvent'
import {SLoader} from './SLoader'

/**
 * Props for the RsDropdown component.
 */
export interface RsDropdownProps extends InputPickerProps, LoadDataProps {
  /**
   * The label for the dropdown.
   */
  label: string
  /**
   * The htmlSize attribute defines the width of the &laquo;input> element.
   */
  htmlSize?: number
  /**
   * Called after the value has been changed.
   * @param value the value.
   */
  onChange?: (value: any) => void
}

/**
 * Dropdown component with label and data loading support.
 * @param props the component props.
 * @param props.data the data for the dropdown.
 * @param props.label the label for the dropdown.
 * @param props.onLoadData the callback for loading data.
 * @param props.onSearch the callback for search.
 * @param props.onOpen the callback for open.
 * @param props.value the value of the dropdown.
 * @param props.className the css class name.
 * @param props.preload whether to preload data.
 * @param props.disableVirtualized whether to disable virtualization.
 * @param props.props the additional dropdown props.
 * @returns the React element.
 */
const RsDropdown = ({
                      data,
                      label,
                      onLoadData,
                      onSearch,
                      onOpen,
                      value = '',
                      className,
                      preload,
                      disableVirtualized,
                      ...props
                    }: RsDropdownProps) => {
  const {loading, ...loadProps} = useLoadData({data, onLoadData, onSearch, onOpen, value, preload, disableVirtualized})
  const onClean = useTouchOnEvent(props, 'onClean')
  const inputRef = useFixAriaAttributesForInputPicker()

  const renderMenu = useCallback((menu: ReactNode) => <>
    {menu}
    {loading && <SLoader/>}
  </>, [loading])

  return (
    <Labeled label={label} className={className} passAriaToChildren={true}>
      <InputPicker
        ref={inputRef}
        {...props}
        {...loadProps}
        onClean={onClean}
        renderMenu={renderMenu}
      />
    </Labeled>
  )
}

export const rsDropdown = define(RsDropdown, 'RsDropdown')
  .name('Dropdown')
  .category(fieldsCategory)
  .props({
    ...pickerProps,
    preload: boolean.default(false),
    label: string.default('Select'),
    data: array.default(toLabeledValues(['a', 'b', 'c']))
  })
