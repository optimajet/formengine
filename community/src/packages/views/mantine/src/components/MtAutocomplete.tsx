import type {AutocompleteProps} from '@mantine/core'
import {Autocomplete} from '@mantine/core'
import {boolean, define, number, string} from '@react-form-builder/core'
import {useMemo} from 'react'
import {comboboxCategory} from './internal/categories'
import type {BaseComboboxProps} from './internal/combobox'
import {baseComboboxProps} from './internal/combobox'
import {deduplicateData} from './internal/deduplicateData'

const MtAutocomplete = (props: AutocompleteProps & BaseComboboxProps) => {
  const {data, ...others} = props
  const deduplicatedData = useMemo(() => deduplicateData(data || []), [data])
  return (
    <Autocomplete
      {...others}
      data={deduplicatedData}
    />
  )
}

export const mtAutocomplete = define(MtAutocomplete, 'MtAutocomplete')
  .category(comboboxCategory)
  // TODO FE-1803 add support for comboboxProps, renderOption, and filter.
  .props({
    ...baseComboboxProps,
    placeholder: string.default('Search'),
    selectFirstOptionOnChange: boolean.default(false),
    autoSelectOnBlur: boolean.default(false),
    limit: number,
  })
