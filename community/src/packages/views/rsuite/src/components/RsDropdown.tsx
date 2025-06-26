import {array, boolean, define, string, toLabeledValues} from '@react-form-builder/core'
import type {ReactNode} from 'react'
import {useCallback} from 'react'
import type {InputPickerProps} from 'rsuite'
import {InputPicker} from 'rsuite'
import {pickerProps} from '../commonProperties'
import type {LoadDataProps} from '../hooks'
import {useLoadData} from '../hooks'
import {Labeled} from './components/Labeled'
import {useTouchOnEvent} from './hooks/useTouchOnEvent'
import {SLoader} from './SLoader'

interface RsDropdownProps extends InputPickerProps, LoadDataProps {
  label: string
}

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

  const renderMenu = useCallback((menu: ReactNode) => <>
    {menu}
    {loading && <SLoader/>}
  </>, [loading])

  return (
    <Labeled label={label} className={className}>
      <InputPicker
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
  .props({
    ...pickerProps,
    preload: boolean.default(false),
    label: string.default('Select'),
    data: array.default(toLabeledValues(['a', 'b', 'c']))
  })
