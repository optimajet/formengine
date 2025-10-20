import styled from '@emotion/styled'
import {boolean, define, string, useAriaAttributes, useComponentData} from '@react-form-builder/core'
import {Search} from '@rsuite/icons'
import type {ReactNode} from 'react'
import {useCallback, useMemo} from 'react'
import type {InputPickerProps} from 'rsuite'
import {InputPicker, Loader} from 'rsuite'
import {pickerProps} from '../commonProperties'
import type {LoadDataProps} from '../hooks'
import {useFixAriaAttributesForInputPicker, useLoadData} from '../hooks'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'
import {useTouchOnEvent} from './hooks/useTouchOnEvent'

const Container = styled.div`
  display: flex;
  flex: 1;

  .search-icon {
    margin-inline-start: -28px;
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

/**
 * Props for the RsSearch component.
 */
export interface RsSearchProps extends InputPickerProps, LoadDataProps {
  /**
   * The label for the search input.
   */
  label: string
  /**
   * Called after the value has been changed.
   * @param value the value.
   */
  onChange?: (value: any) => void
}

const CustomCaret = () => null

/**
 * Search component with label and data loading support.
 * @param props the component props.
 * @param props.data the data for the search.
 * @param props.label the label for the search input.
 * @param props.onLoadData the callback for loading data.
 * @param props.onSearch the callback for search.
 * @param props.value the value of the search.
 * @param props.className the CSS class name.
 * @param props.preload whether to preload data.
 * @param props.disableVirtualized whether to disable virtualization.
 * @param props.props the additional search props.
 * @returns the React element.
 */
const RsSearch = ({data, label, onLoadData, onSearch, value = '', className, preload, disableVirtualized, ...props}: RsSearchProps) => {
  const {loading, onOpen, ...loadProps} = useLoadData({data, onLoadData, onSearch, value, preload, disableVirtualized})

  const renderMenu = useCallback((menu: ReactNode) => {
    return loadProps.data?.length ? menu : null
  }, [loadProps.data?.length])

  const onClean = useTouchOnEvent(props, 'onClean')
  const Icon = loading ? Loader : Search
  const {id} = useComponentData()
  const aria = useAriaAttributes({labeled: !!label})
  const inputRef = useFixAriaAttributesForInputPicker()

  const icon = useMemo(() => {
    return !(props.cleanable && value) ? <Icon className={'search-icon'}/> : null
  }, [Icon, props.cleanable, value])

  return (
    <Labeled label={label} className={className} passAriaToChildren={false}>
      <Container>
        <SInputPicker id={id} {...aria} {...props} {...loadProps} onClean={onClean} renderMenu={renderMenu} caretAs={CustomCaret}
                      ref={inputRef}/>
        {icon}
      </Container>
    </Labeled>
  )
}

export const rsSearch = define(RsSearch, 'RsSearch')
  .name('Search')
  .category(fieldsCategory)
  .props({
    ...pickerProps,
    preload: boolean.default(false),
    label: string.default('Search'),
    placeholder: string.default('Search')
  })
