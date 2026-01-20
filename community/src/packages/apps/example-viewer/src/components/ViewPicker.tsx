import type {ReactNode} from 'react'
import type {SelectPickerProps} from 'rsuite'
import {SelectPicker} from 'rsuite'
import type {ItemDataType} from 'rsuite/esm/internals/types'
import {material, rsuite} from '../images/icons'
import type {ViewType} from './ViewContext'
import {useView} from './ViewContext'

type Labeled = {value: ViewType; label: string; icon?: ReactNode}

const items: Labeled[] = [
  {value: 'rsuite', label: 'RSuite UI', icon: rsuite},
  {value: 'mui', label: 'Material UI', icon: material},
]

const iconItemStyle = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
}

const renderItem = (_: unknown, item: ItemDataType) => (
  <div style={iconItemStyle}>
    {item?.icon}
    {item?.label}
  </div>
)

/**
 * Component for selecting the view type (RSuite or Material UI).
 * @param props the SelectPicker props.
 * @returns the React element.
 */
export const ViewPicker = (props: Partial<SelectPickerProps>) => {
  const {view, setView} = useView()

  return (
    <SelectPicker
      data={items}
      value={view}
      onChange={setView as SelectPickerProps['onChange']}
      renderMenuItem={renderItem}
      renderValue={renderItem}
      size={'sm'}
      searchable={false}
      cleanable={false}
      className={'subtle-style'}
      {...props}
    />
  )
}
