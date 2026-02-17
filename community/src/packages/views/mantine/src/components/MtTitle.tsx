import {Title} from '@mantine/core'
import {color, define, number, oneOf, oneOfStrict, string} from '@react-form-builder/core'
import {typographyCategory} from './internal/categories'
import {titleStyleProps} from './internal/textStyleProps'

export const mtTitle = define(Title, 'MtTitle')
  .category(typographyCategory)
  .props({
    children: string.required.default('Title').dataBound,
    order: oneOf(1, 2, 3, 4, 5, 6)
      .default(4)
      .withEditorProps({creatable: false}),
    size: string,
    lineClamp: number,
    textWrap: oneOfStrict('wrap', 'nowrap', 'balance'),
    ...titleStyleProps,
  })
  .css({
    backgroundColor: color,
    textAlign: oneOf('start', 'center', 'end').default('start').radio(),
    color,
  })
