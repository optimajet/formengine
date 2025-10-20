import type {LabeledValue} from '@react-form-builder/core'
import {array, define, toLabeledValues} from '@react-form-builder/core'
import {useEffect, useMemo, useRef} from 'react'
import type {PickerHandle, TagPickerProps} from 'rsuite'
import {TagPicker} from 'rsuite'
import {pickerProps} from '../commonProperties'
import {setAriaHiddenIfNotExists} from '../hooks'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'
import {useTouchOnEvent} from './hooks/useTouchOnEvent'

/**
 * Props for the RsTagPicker component.
 */
export interface RsTagPickerProps extends TagPickerProps {
  /**
   * Label for the tag picker.
   */
  label: string
  /**
   * Called after the value has been changed.
   * @param value the value.
   */
  onChange?: (value: any) => void
}

const fixEmptyItem = ({value, label}: LabeledValue) => ({
  value: value ?? '',
  label: label ?? ''
})

const EMPTY_LIST = [] as const

/**
 * Tag picker component with label support.
 * @param props the component props.
 * @param props.data the data for the tag picker.
 * @param props.label the label for the tag picker.
 * @param props.value the value of the tag picker.
 * @param props.className the CSS class name.
 * @param props.props the additional tag picker props.
 * @returns the React element.
 */
const RsTagPicker = ({data, label, value, className, ...props}: RsTagPickerProps) => {
  const inputRef = useRef<PickerHandle>(null)
  const onClean = useTouchOnEvent(props, 'onClean')

  useEffect(() => {
    const searchInput = inputRef.current?.root?.querySelector('.rs-picker-search-input input')
    setAriaHiddenIfNotExists(searchInput)
  }, [])

  const transformedData = useMemo(() => {
    return toLabeledValues((data ?? []) as Array<string | LabeledValue>).map(fixEmptyItem)
  }, [data])

  return (
    <Labeled label={label} className={className} passAriaToChildren={true}>
      <TagPicker
        value={value ?? EMPTY_LIST}
        data={transformedData}
        onClean={onClean}
        {...props}
        ref={inputRef}
      />
    </Labeled>
  )
}

const {disableVirtualized, onLoadData, ...tagPickerProps} = pickerProps

export const rsTagPicker = define(RsTagPicker, 'RsTagPicker')
  .name('TagPicker')
  .category(fieldsCategory)
  .props({
    ...tagPickerProps,
    value: array.valued.ofString,
    label: pickerProps.label.default('Select'),
    data: array.default(toLabeledValues(['a', 'b', 'c']))
  })
