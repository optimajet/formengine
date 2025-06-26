import styled from '@emotion/styled'
import {define, oneOf, string} from '@react-form-builder/core'
import type {ComponentProps} from 'react'
import logo from '../../public/images/logo.png'
import type {AreaProps} from '../commonTypes'

interface RsImageProps extends ComponentProps<'img'>, AreaProps {
}

const SImage = styled.img`
  width: 100%;
  height: 100%;
`

const RsImage = ({alt, ...props}: RsImageProps) => <SImage {...props} alt={alt}/>

export const rsImage = define(RsImage, 'RsImage')
  .name('Image')
  .props({
    src: string.required.default(logo).hinted('Image source'),
    alt: string.named('Description').default('Image').hinted('Image description'),
  })
  .css({
    objectPosition: oneOf('top', 'bottom', 'left', 'right', 'center').default('left'),
    objectFit: oneOf('contain', 'cover', 'fill', 'none', 'scale-down').default('scale-down')
  })
  .preview(<img src={logo} width="200px" height="auto" alt="Image"/>)
