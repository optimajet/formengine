import type {SelectProps} from '@mantine/core'
import {Select} from '@mantine/core'
import {boolean, define, number, oneOfStrict, string} from '@react-form-builder/core'
import {useMemo} from 'react'
import {baseInputProps} from './internal/baseInputProps'
import {comboboxCategory} from './internal/categories'
import type {BaseComboboxProps} from './internal/combobox'
import {baseComboboxProps} from './internal/combobox'
import {deduplicateData} from './internal/deduplicateData'

const MtSelect = (props: SelectProps & BaseComboboxProps) => {
  const {data, ...others} = props
  const deduplicatedData = useMemo(() => deduplicateData(data || []), [data])
  return (
    <Select
      {...others}
      data={deduplicatedData}
    />
  )
}

export const mtSelect = define(MtSelect, 'MtSelect')
  .category(comboboxCategory)
  // TODO FE-1803 add support for comboboxProps, renderOption, and filter.
  .props({
    ...baseComboboxProps,
    placeholder: string.default('Pick one'),
    searchable: boolean.default(false),
    allowDeselect: boolean.default(true),
    limit: number,
    checkIconPosition: oneOfStrict('left', 'right'),
    withCheckIcon: boolean.default(true),
    withAlignedLabels: boolean.default(false),
    value: baseInputProps.value.uncontrolledValue(null),
  })
