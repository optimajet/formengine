import {boolean, define, string} from '@react-form-builder/core'

interface RsStaticContentProps {
  content: string
  allowHtml: boolean
}

const RsStaticContent = (props: RsStaticContentProps) => {
  const {content, allowHtml, ...otherProps} = props
  if (allowHtml) return <span dangerouslySetInnerHTML={{__html: content}} {...otherProps}/>
  return <span {...otherProps}>{content}</span>
}

export const rsStaticContent = define(RsStaticContent, 'RsStaticContent')
  .name('Static content')
  .props({
    content: string.required.default('Text...').dataBound,
    allowHtml: boolean.named('Allow HTML').default(false),
  })
