import {define, string, useBuilderValue} from '@react-form-builder/core'
import {textStyles} from '../commonProperties'
import type {TextProps} from '../commonTypes'
import {staticCategory} from './categories'

const defaultText = 'Label'

/**
 * Props for the RsLabel component.
 */
export interface RsLabelProps extends TextProps {
  /**
   * The label text content.
   */
  text: string
}

/**
 * A label component that displays text content.
 * @param props the component props.
 * @param props.text the text content to display.
 * @returns the React element.
 */
const RsLabel = ({text, ...props}: RsLabelProps) => {
  const children = useBuilderValue(text, defaultText)
  return <label {...props}>{children}</label>
}

export const rsLabel = define(RsLabel, 'RsLabel')
  .name('Label')
  .category(staticCategory)
  .props({
    text: string.default(defaultText).dataBound,
  })
  .css({
    ...textStyles
  })
  .componentRole('label')
