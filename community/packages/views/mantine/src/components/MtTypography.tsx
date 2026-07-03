import {Text, Typography} from '@mantine/core'
import {boolean, define, string, useBuilderValue} from '@react-form-builder/core'
import {useMemo} from 'react'
import {typographyCategory} from './internal/categories'
import {textStyleProps} from './internal/textStyleProps'

/**
 * Props for the MtTypography component.
 */
export interface MtTypographyProps {
  /**
   * The content text to display.
   */
  content: string
  /**
   * Whether to render the content as HTML or plain text.
   */
  allowHtml: boolean
}

/**
 * Mantine static content component for React Form Builder.
 * @param props component properties.
 * @returns static content component.
 */
export function MtTypography(props: MtTypographyProps) {
  const {content, allowHtml, ...otherProps} = props
  const data = useBuilderValue(content, 'Text')
  const html = useMemo(() => ({__html: data}), [data])

  if (allowHtml) {
    return <Typography {...otherProps} dangerouslySetInnerHTML={html}/>
  }

  return <Text {...otherProps}>{data}</Text>
}

export const mtTypography = define(MtTypography, 'MtTypography')
  .category(typographyCategory)
  .props({
    content: string.required.default('Text').dataBound,
    allowHtml: boolean.default(false),
    ...textStyleProps,
  })
