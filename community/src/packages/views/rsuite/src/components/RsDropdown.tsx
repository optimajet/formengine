import {array, boolean, define, string, toLabeledValues} from '@react-form-builder/core'
import type {ReactNode} from 'react'
import {useCallback, useEffect, useRef} from 'react'
import type {InputPickerProps, PickerHandle} from 'rsuite'
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

  const inputRef = useRef<PickerHandle>(null)
  const {loading, ...loadProps} = useLoadData({data, onLoadData, onSearch, onOpen, value, preload, disableVirtualized})
  const onClean = useTouchOnEvent(props, 'onClean')

  useEffect(() => {
    const rsPickerSearch = inputRef.current?.root?.querySelector('input.rs-picker-search-input')
    if (rsPickerSearch && !rsPickerSearch.hasAttribute('aria-hidden')) {
      rsPickerSearch.setAttribute('aria-hidden', 'true')
    }
  }, [])

  const renderMenu = useCallback((menu: ReactNode) => <>
    {menu}
    {loading && <SLoader/>}
  </>, [loading])

  return (
    <Labeled label={label} className={className}>
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
  .props({
    ...pickerProps,
    preload: boolean.default(false),
    label: string.default('Select'),
    data: array.default(toLabeledValues(['a', 'b', 'c']))
  })
