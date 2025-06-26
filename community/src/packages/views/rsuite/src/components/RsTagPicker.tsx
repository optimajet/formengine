import type {LabeledValue} from '@react-form-builder/core'
import {array, define, toLabeledValues} from '@react-form-builder/core'
import {useMemo} from 'react'
import type {TagPickerProps} from 'rsuite'
import {TagPicker} from 'rsuite'
import {pickerProps} from '../commonProperties'
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
  const onClean = useTouchOnEvent(props, 'onClean')

  const transformedData = useMemo(() => {
    return toLabeledValues((data ?? []) as LabeledValue[]).map(fixEmptyItem)
  }, [data])

  return (
    <Labeled label={label} className={className}>
      <TagPicker
        value={value ?? []}
        data={transformedData}
        onClean={onClean}
        {...props}
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
