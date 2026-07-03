import {Input} from '@mantine/core'
import {boolean, color, define, oneOf, string} from '@react-form-builder/core'
import {inputsCategory} from './internal/categories'
import {size} from './internal/sharedProps'

export const mtLabel = define(Input.Label, 'MtLabel')
  .category(inputsCategory)
  .props({
    children: string.default('Label').dataBound,
    size: size,
    required: boolean.default(false),
  })
  .css({
    ta: oneOf('start', 'center', 'end').default('start').radio(),
    fz: string,
    fw: oneOf('lighter', 'normal', 'bold').default('normal'),
    c: color,
  })
  .componentRole('label')
