import {boolean, define, string, useBuilderValue} from '@react-form-builder/core'
import {useMemo} from 'react'

const defaultContent = 'Text...'

interface RsStaticContentProps {
  content: string
  allowHtml: boolean
}

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
  .props({
    content: string.required.default(defaultContent).dataBound,
    allowHtml: boolean.named('Allow HTML').default(false),
  })
