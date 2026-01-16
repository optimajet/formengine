import {FormLabel, RadioGroup} from '@mui/material'
import {boolean, ComponentStore, define, event, node, string} from '@react-form-builder/core'
import {inputsCategory} from './categories'
import {formControlProperties} from './internal/FormControl/defineFormControl'
import {withFormControl} from './internal/FormControl/FormControl'

const muiRadioGroupType = 'MuiRadioGroup'

const getInitialJson = () => {
  const componentStore = new ComponentStore(muiRadioGroupType, muiRadioGroupType)
  componentStore.children = [1, 2, 3].map((itemNumber) => {
    const item = new ComponentStore('MuiRadioItem', 'MuiRadioItem')
    item.props = {
      label: {
        value: `Radio item ${itemNumber}`,
      },
      value: {
        value: itemNumber,
      }
    }
    return item
  })
  return JSON.stringify(componentStore)
}

const options = {
  labelComponent: FormLabel
}

const MuiRadioGroup = withFormControl(RadioGroup, options)

export const muiRadioGroup = define(MuiRadioGroup, muiRadioGroupType)
  .icon('RadioGroup')
  .category(inputsCategory)
  .props({
    name: string.default('RadioGroup'),
    row: boolean,
    value: string.valued.uncontrolledValue(''),
    children: node,
    onChange: event,
    ...formControlProperties
  })
  .initialJson(getInitialJson())
