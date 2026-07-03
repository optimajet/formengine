import {define, oneOf, string, useBuilderValue} from '@react-form-builder/core'
import cx from 'clsx'
import type {ComponentProps} from 'react'
import rawLogo from '../../public/images/logo.svg?raw'
import type {AreaProps} from '../commonTypes'
import {staticCategory} from './categories'
import styles from './RsImage.module.css'

/**
 * Props for the RsImage component.
 */
export interface RsImageProps extends ComponentProps<'img'>, AreaProps {
}

const inlineLogo = `data:image/svg+xml,${encodeURIComponent(rawLogo)}`

/**
 * An image component that displays an image with configurable source and styling.
 * @param props the component props.
 * @param props.alt the alternative text for the image.
 * @param props.src the image source URL.
 * @param props.className the CSS class name.
 * @returns the React element.
 */
const RsImage = ({alt, src, className, ...props}: RsImageProps) => {
  const source = useBuilderValue(src, inlineLogo)

  return <img {...props} className={cx(styles.image, className)} alt={alt} src={source}/>
}

export const rsImage = define(RsImage, 'RsImage')
  .name('Image')
  .category(staticCategory)
  .props({
    src: string.required.default(inlineLogo).dataBound,
    alt: string.default('Image'),
  })
  .css({
    objectPosition: oneOf('top', 'bottom', 'left', 'right', 'center').default('left'),
    objectFit: oneOf('contain', 'cover', 'fill', 'none', 'scale-down').default('scale-down')
      .withEditorProps({creatable: false}),
  })
