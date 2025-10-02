import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import type {InputPickerProps, PickerHandle} from 'rsuite'
import type {ValueType} from 'rsuite/esm/InputPicker/InputPicker'
import type {ItemDataType} from 'rsuite/esm/internals/types'
import type {ListProps} from 'rsuite/esm/internals/Windowing'

/**
 * The callback function for loading data into the component.
 * @param newData the new data to be loaded into the component.
 */
export type LoadCallback = (newData: ItemDataType[]) => void

/**
 * Describes a function that is called when data is to be loaded into the component.
 * @param searchKeyword the current search value.
 * @param loadCallback the callback function called to set the data in the component.
 * @param currentDataLength the length of the data already loaded.
 */
export type LoadDataHandler = (
  searchKeyword: string,
  loadCallback: LoadCallback,
  currentDataLength: number
) => {}


/**
 * Interface for load data props.
 */
export interface LoadDataProps {
  /**
   * The callback function called when data should be load.
   */
  onLoadData?: LoadDataHandler
  /**
   * Flag, if true, the data will be loaded in advance, before opening the dropdown, false otherwise.
   */
  preload?: boolean
  /**
   * Flag, if true, the virtualized will be disabled, false otherwise.
   */
  disableVirtualized?: boolean
}

/**
 * Props for the useLoadData hook combining InputPickerProps and LoadDataProps.
 */
interface UseLoadDataProps extends Pick<InputPickerProps,
  'data' | 'value' | 'onSearch' | 'onOpen' | 'onCreate'>, LoadDataProps {
}

/**
 * Implements data loading and infinite loader logic for RSuite picker components.
 * @param props the React component properties.
 * @param props.data the data for the picker.
 * @param props.onLoadData the callback function called when data should be load.
 * @param props.onSearch the callback function called when a search is performed.
 * @param props.onOpen the callback function called when the list is displayed.
 * @param props.value the current value of the component.
 * @param props.preload flag, if true, the data will be loaded in advance, before opening the dropdown, false otherwise.
 * @param props.disableVirtualized flag, if true, the virtualized will be disabled, false otherwise.
 * @returns the object with prepared properties for the picker.
 */
export const useLoadData = ({data: initialData, onLoadData, value, preload, disableVirtualized, ...props}: UseLoadDataProps) => {
  // TODO lint ignored, will be fixed after merger with #FE-619
  const [searchValue, setSearchValue] = useState('')
  const [data, setData] = useState<ItemDataType[]>(initialData ?? [])
  const [loading, setLoading] = useState(false)
  const hasValue = useCallback((item: ItemDataType) => item.value === value, [value])

  const loadCallback: LoadCallback = useCallback((newData) => {
    let filteredData = data

    if (value && newData.some(hasValue)) {
      filteredData = data.filter(item => !hasValue(item))
    }

    setData([...filteredData, ...newData])
    setLoading(false)
  }, [data, hasValue, value])

  useEffect(() => {
    if (preload) onLoadData?.('', loadCallback, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preload, onLoadData])

  useEffect(() => {
    const valueItem = value && !initialData?.some(hasValue) ? [{value, label: value}] : []
    setData([
      ...valueItem,
      ...(initialData ?? [])
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  useEffect(() => {
    if (!searchValue) return
    if (onLoadData) setLoading(true)
    onLoadData?.(searchValue, loadCallback, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  const listProps: Partial<ListProps> = {
    onItemsRendered: ({visibleStopIndex}) => {
      if (onLoadData && (visibleStopIndex >= data.length - 1)) {
        setLoading(true)
        onLoadData(searchValue, loadCallback, data.length)
      }
    }
  }

  const onSearch = useCallback((value: string) => {
    if (onLoadData) setData([])
    setSearchValue(value)
    props.onSearch?.(value)
  }, [onLoadData, props])

  const onOpen = useCallback(() => {
    props.onOpen?.()
    if (!value && !preload) onLoadData?.('', loadCallback, 0)
  }, [props, value, preload, onLoadData, loadCallback])

  const onCreate: InputPickerProps['onCreate'] = useCallback((_: ValueType, item: ItemDataType) => {
    setData([item, ...data])
    setSearchValue('')
  }, [data])

  const virtualized = !!onLoadData && disableVirtualized !== true

  return {data, value, loading, listProps, onSearch, onOpen, onCreate, virtualized}
}

/**
 * Sets aria-hidden="true" on the HTML element if the attribute is not already set.
 * @param element element on which to set the aria-hidden attribute to true.
 */
export function setAriaHiddenIfNotExists(element: Element | null | undefined) {
  if (element && !element.hasAttribute('aria-hidden')) {
    element.setAttribute('aria-hidden', 'true')
  }
}

/**
 * Adds aria-hidden to the internal input of the RSuite InputPicker.
 * @returns ref that should be set by the InputPicker component.
 */
export const useFixAriaAttributesForInputPicker = () => {
  const inputRef = useRef<PickerHandle>(null)
  useEffect(() => {
    const rsPickerSearch = inputRef.current?.root?.querySelector('input.rs-picker-search-input')
    setAriaHiddenIfNotExists(rsPickerSearch)
  }, [])
  return inputRef
}

/**
 * Returns the memoized conversion value over an array.
 * @param array the array.
 * @param mapFn the conversion function.
 * @returns the memoized conversion value over an array.
 */
export const useArrayMapMemo = <T, R>(array: T[] | undefined,
                                      mapFn: (item: T, index: number) => R) => {
  const length = array?.length
  return useMemo(() => {
    if (!length) return []
    return array.map(mapFn)
  }, [array, length, mapFn])
}
