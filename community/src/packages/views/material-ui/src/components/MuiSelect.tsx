import type {SelectProps} from '@mui/material'
import {InputLabel, MenuItem, Select} from '@mui/material'
import type {LabeledValue} from '@react-form-builder/core'
import {array, define, oneOfStrict, readOnly, string, toLabeledValues} from '@react-form-builder/core'
import {inputsCategory} from './categories'
import {formControlProperties} from './internal/FormControl/defineFormControl'
import {withFormControl} from './internal/FormControl/FormControl'
import {useLabelId} from './internal/FormControl/useLabelId'
import {useReadOnlySlotProp} from './internal/useReadOnlySlotProp'

/**
 * The MuiSelect component properties.
 */
export interface MuiSelectProps extends Omit<SelectProps<string>, 'onChange'> {
  /**
   * The select items.
   */
  items?: LabeledValue[]
  /**
   * The select value.
   */
  value?: string
}

const MuiSelect = ({items = [], readOnly, ...props}: MuiSelectProps) => {
  const labelId = useLabelId()
  const slotProps = useReadOnlySlotProp(readOnly)
  return (
    <Select labelId={labelId} slotProps={slotProps} {...props}>
      {items.map(item => (
        <MenuItem key={item.value} value={item.value}>
          {item.label}
        </MenuItem>
      ))}
    </Select>
  )
}

const MuiSelectFormControl = withFormControl(MuiSelect, {labelComponent: InputLabel})

export const muiSelect = define(MuiSelectFormControl, 'MuiSelect')
  .icon('Dropdown')
  .category(inputsCategory)
  .props({
    value: string.valued.uncontrolledValue(''),
    items: array.default(toLabeledValues(['Item1', 'Item2', 'Item3'])),
    variant: oneOfStrict('outlined', 'standard', 'filled'),
    size: oneOfStrict('small', 'medium', 'large'),
    ...formControlProperties,
    readOnly: readOnly
  })
