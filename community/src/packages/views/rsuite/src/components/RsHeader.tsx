import {define, string} from '@react-form-builder/core'
import {createElement} from 'react'
import {backgroundColor, headerSize, textStyles} from '../commonProperties'
import type {TextProps} from '../commonTypes'

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
  return createElement(headerSize, {children: content, ...props})
}

const {textAlign, color} = textStyles

export const rsHeader = define(RsHeader, 'RsHeader')
  .name('Header')
  .props({
    content: string.required.default('Header').dataBound,
    headerSize
  })
  .css({
    backgroundColor,
    textAlign,
    color
  })

