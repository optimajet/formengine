import {define, string, useBuilderValue} from '@react-form-builder/core'
import {createElement} from 'react'
import {backgroundColor, headerSize, textStyles} from '../commonProperties'
import type {TextProps} from '../commonTypes'

const defaultContent = 'Header'

interface RsHeaderProps extends TextProps {
  content?: string
  headerSize: string
}

/**
 * React component that displays the header.
 * @param props the React component properties.
 * @param props.content the header text.
 * @param props.headerSize the header size.
 * @param props.props the other wrapped properties of the component.
 * @returns the React element.
 */
export const RsHeader = ({content, headerSize, ...props}: RsHeaderProps) => {
  const children = useBuilderValue(content, defaultContent)
  return createElement(headerSize, props, children)
}

const {textAlign, color} = textStyles

export const rsHeader = define(RsHeader, 'RsHeader')
  .name('Header')
  .props({
    content: string.required.default(defaultContent).dataBound,
    headerSize
  })
  .css({
    backgroundColor,
    textAlign,
    color
  })
