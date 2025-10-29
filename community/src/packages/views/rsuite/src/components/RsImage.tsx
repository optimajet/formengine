import styled from '@emotion/styled'
import {define, oneOf, string, useBuilderValue} from '@react-form-builder/core'
import type {ComponentProps} from 'react'
import logo from '../../public/images/logo.png'
import type {AreaProps} from '../commonTypes'
import {staticCategory} from './categories'

/**
 * Props for the RsImage component.
 */
export interface RsImageProps extends ComponentProps<'img'>, AreaProps {
}

const SImage = styled.img`
  width: 100%;
  height: 100%;
`

/**
 * An image component that displays an image with configurable source and styling.
 * @param props the component props.
 * @param props.alt the alternative text for the image.
 * @param props.src the image source URL.
 * @returns the React element.
 */
const RsImage = ({alt, src, ...props}: RsImageProps) => {
  const source = useBuilderValue(src, logo)
  return <SImage {...props} alt={alt} src={source}/>
}

export const rsImage = define(RsImage, 'RsImage')
  .name('Image')
  .category(staticCategory)
  .props({
    src: string.required.default(logo).hinted('Image source').dataBound,
    alt: string.named('Description').default('Image').hinted('Image description'),
  })
  .css({
    objectPosition: oneOf('top', 'bottom', 'left', 'right', 'center').default('left'),
    objectFit: oneOf('contain', 'cover', 'fill', 'none', 'scale-down').default('scale-down')
      .withEditorProps({creatable: false}),
  })
