import type {LabeledValue} from '@react-form-builder/core'
import {array, define, toLabeledValues} from '@react-form-builder/core'
import {useEffect, useMemo, useRef} from 'react'
import type {PickerHandle, TagPickerProps} from 'rsuite'
import {TagPicker} from 'rsuite'
import {pickerProps} from '../commonProperties'
import {setAriaHiddenIfNotExists} from '../hooks'
import {Labeled} from './components/Labeled'
import {useTouchOnEvent} from './hooks/useTouchOnEvent'

interface RsTagPickerProps extends TagPickerProps {
  label: string
}

const fixEmptyItem = ({value, label}: LabeledValue) => ({
  value: value ?? '',
  label: label ?? ''
})

const RsTagPicker = ({data, label, value, className, ...props}: RsTagPickerProps) => {
  const inputRef = useRef<PickerHandle>(null)
  const onClean = useTouchOnEvent(props, 'onClean')

  useEffect(() => {
    const searchInput = inputRef.current?.root?.querySelector('.rs-picker-search-input input')
    setAriaHiddenIfNotExists(searchInput)
  }, [])

  const transformedData = useMemo(() => {
    return toLabeledValues((data ?? []) as LabeledValue[]).map(fixEmptyItem)
  }, [data])

  return (
    <Labeled label={label} className={className} passAriaToChildren={true}>
      <TagPicker
        value={value ?? []}
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
  .props({
    ...tagPickerProps,
    value: array.valued.ofString,
    label: pickerProps.label.default('Select'),
    data: array.default(toLabeledValues(['a', 'b', 'c']))
  })
