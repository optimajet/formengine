import type {MultiSelectProps} from '@mantine/core'
import {MultiSelect} from '@mantine/core'
import {array, boolean, define, number, oneOfStrict, required} from '@react-form-builder/core'
import {useMemo} from 'react'
import {comboboxCategory} from './internal/categories'
import type {BaseComboboxProps} from './internal/combobox'
import {baseComboboxProps} from './internal/combobox'
import {deduplicateData} from './internal/deduplicateData'
import {onChange} from './internal/sharedProps'

const MtMultiSelect = (props: MultiSelectProps & BaseComboboxProps) => {
  const {data, ...others} = props
  const deduplicatedData = useMemo(() => deduplicateData(data || []), [data])
  return (
    <MultiSelect
      {...others}
      data={deduplicatedData}
    />
  )
}

export const mtMultiSelect = define(MtMultiSelect, 'MtMultiSelect')
  .category(comboboxCategory)
  // TODO FE-1803 add support for comboboxProps, renderOption, and filter.
  .props({
    ...baseComboboxProps,
    value: array.valued.uncontrolledValue([]),
    clearable: boolean.default(true),
    limit: number,
    maxValues: number,
    searchable: boolean.default(false),
    hidePickedOptions: boolean.default(false),
    checkIconPosition: oneOfStrict('left', 'right'),
    withCheckIcon: boolean.default(true),
    withAlignedLabels: boolean.default(false),
    withAsterisk: required,
    onChange: onChange,
  })
