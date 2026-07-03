import type {TagsInputProps} from '@mantine/core'
import {TagsInput} from '@mantine/core'
import {array, boolean, define, number, required, string} from '@react-form-builder/core'
import {useMemo} from 'react'
import {comboboxCategory} from './internal/categories'
import type {BaseComboboxProps} from './internal/combobox'
import {baseComboboxProps} from './internal/combobox'
import {deduplicateData} from './internal/deduplicateData'

const MtTagsInput = (props: TagsInputProps & BaseComboboxProps) => {
  const {data, ...others} = props
  const deduplicatedData = useMemo(() => deduplicateData(data || []), [data])
  return (
    <TagsInput
      {...others}
      data={deduplicatedData}
    />
  )
}

export const mtTagsInput = define(MtTagsInput, 'MtTagsInput')
  .category(comboboxCategory)
  // TODO FE-1803 add support for comboboxProps, renderOption, filter, isDuplicate, and clearButtonProps.
  .props({
    ...baseComboboxProps,
    placeholder: string.default('Add tags'),
    acceptValueOnBlur: boolean.default(true),
    allowDuplicates: boolean.default(false),
    splitChars: array,
    maxTags: number,
    value: array.valued,
    withAsterisk: required,
  })
