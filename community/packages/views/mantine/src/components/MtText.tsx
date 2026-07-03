import type {TextProps} from '@mantine/core'
import {Text} from '@mantine/core'
import {boolean, define, number, oneOfStrict, string} from '@react-form-builder/core'
import type {ReactNode} from 'react'
import {typographyCategory} from './internal/categories'
import {size} from './internal/sharedProps'
import {textStyleProps} from './internal/textStyleProps'

interface MtTextProps extends TextProps {
  children?: ReactNode
}

const MtText = (props: MtTextProps) => {
  return <Text {...props}/>
}

export const mtText = define(MtText, 'MtText')
  .category(typographyCategory)
  // TODO FE-1803 add support for gradient.
  .props({
    children: string.default('Text').dataBound,
    ...textStyleProps,
    variant: oneOfStrict('text', 'gradient'),
    inherit: boolean,
    inline: boolean,
    lineClamp: number,
    size: size,
    span: boolean,
    truncate: oneOfStrict('start', 'end'),
  })
