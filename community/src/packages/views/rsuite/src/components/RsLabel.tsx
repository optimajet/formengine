import {define, string, useBuilderValue} from '@react-form-builder/core'
import {textStyles} from '../commonProperties'
import type {TextProps} from '../commonTypes'

const defaultText = 'Label'

interface RsLabelProps extends TextProps {
  text: string
}

const RsLabel = ({text, ...props}: RsLabelProps) => {
  const children = useBuilderValue(text, defaultText)
  return <label {...props}>{children}</label>
}

export const rsLabel = define(RsLabel, 'RsLabel')
  .name('Label')
  .props({
    text: string.default(defaultText).dataBound,
  })
  .css({
    ...textStyles
  })
  .componentRole('label')
