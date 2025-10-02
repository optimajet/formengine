import {boolean, define, string, useBuilderValue} from '@react-form-builder/core'
import {useMemo} from 'react'
import {staticCategory} from './categories'

const defaultContent = 'Text...'

/**
 * Props for the RsStaticContent component.
 */
export interface RsStaticContentProps {
  /**
   * The content to display.
   */
  content: string
  /**
   * Whether to allow HTML content.
   */
  allowHtml: boolean
}

/**
 * A static content component that displays text or HTML content.
 * @param props the component props.
 * @returns the React element.
 */
const RsStaticContent = (props: RsStaticContentProps) => {
  const {content, allowHtml, ...otherProps} = props
  const data = useBuilderValue(content, defaultContent)
  const html = useMemo(() => ({__html: data}), [data])

  if (allowHtml) {
    return <span {...otherProps} dangerouslySetInnerHTML={html}/>
  }

  return <span {...otherProps}>{data}</span>
}

export const rsStaticContent = define(RsStaticContent, 'RsStaticContent')
  .name('Static content')
  .category(staticCategory)
  .props({
    content: string.required.default(defaultContent).dataBound,
    allowHtml: boolean.named('Allow HTML').default(false),
  })
