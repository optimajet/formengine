import {Divider} from '@mantine/core'
import {define, oneOf, oneOfStrict, string} from '@react-form-builder/core'
import {miscellaneousCategory} from './internal/categories'

export const mtDivider = define(Divider, 'MtDivider')
  .category(miscellaneousCategory)
  .props({
    label: string,
    labelPosition: oneOf('left', 'center', 'right').default('center'),
    orientation: oneOf('horizontal', 'vertical')
      .default('horizontal'),
    size: string,
    color: string,
    variant: oneOfStrict('solid', 'dashed', 'dotted').default('solid'),
  })
