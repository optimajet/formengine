import styled from '@emotion/styled'
import {boolean, define, string} from '@react-form-builder/core'
import {Search} from '@rsuite/icons'
import type {ReactNode} from 'react'
import type {InputPickerProps} from 'rsuite'
import {InputPicker, Loader} from 'rsuite'
import {pickerProps} from '../commonProperties'
import type {LoadDataProps} from '../hooks'
import {useLoadData} from '../hooks'
import {Labeled} from './components/Labeled'
import {useTouchOnEvent} from './hooks/useTouchOnEvent'

const Container = styled.div`
  display: flex;
  flex: 1;

  .search-icon {
    margin-left: -28px;
    margin-top: 10px;
    z-index: 10;
  }

  .rs-loader .rs-loader-spin, .rs-loader .rs-loader-spin:after, .rs-loader .rs-loader-spin:before {
    height: 16px !important;
    width: 16px !important;
  }
`

const SInputPicker = styled(InputPicker)`
  flex: 1;
`

interface RsSearchProps extends InputPickerProps, LoadDataProps {
  label: string
}

const CustomCaret = () => null

const RsSearch = ({data, label, onLoadData, onSearch, value = '', className, preload, disableVirtualized, ...props}: RsSearchProps) => {
  const {loading, onOpen, ...loadProps} = useLoadData({data, onLoadData, onSearch, value, preload, disableVirtualized})
  const renderMenu = (menu: ReactNode) => loadProps.data?.length ? menu : null
  const onClean = useTouchOnEvent(props, 'onClean')

  const Icon = loading ? Loader : Search

  return (
    <Labeled label={label} className={className}>
      <Container>
        <SInputPicker {...props} {...loadProps} onClean={onClean} renderMenu={renderMenu} caretAs={CustomCaret}/>
        {!(props.cleanable && value) && <Icon className={'search-icon'}/>}
      </Container>
    </Labeled>
  )
}

export const rsSearch = define(RsSearch, 'RsSearch')
  .name('Search')
  .props({
    ...pickerProps,
    preload: boolean.default(false),
    label: string.default('Search'),
    placeholder: string.default('Search')
  })
