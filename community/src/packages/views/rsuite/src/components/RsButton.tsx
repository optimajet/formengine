import {boolean, define, disabled, event, oneOf, string, useBuilderValue} from '@react-form-builder/core'
import type {ButtonProps} from 'rsuite'
import {Button} from 'rsuite'
import {controlColor, size} from '../commonProperties'
import {staticCategory} from './categories'

const defaultContent = 'Button'

const RsButton = ({children, ...props}: ButtonProps) => {
  const content = useBuilderValue(children, defaultContent)
  return <Button {...props}>{content}</Button>
}

export const rsButton = define(RsButton, 'RsButton')
  .name('Button')
  .category(staticCategory)
  .props({
    active: boolean.hinted('A button can show it is currently the active user selection').default(false),
    appearance: oneOf('default', 'primary', 'link', 'subtle', 'ghost')
      .default('default')
      .hinted('A button can have different appearances')
      .withEditorProps({creatable: false}),
    children: string.required.named('Content').default(defaultContent).dataBound,
    color: controlColor,
    disabled: disabled.hinted('A button can show it is currently unable to be interacted with').default(false),
    href: string.hinted('Providing a href will render an <a> element'),
    loading: boolean.hinted('A button can show a loading indicator').default(false),
    size,
    onClick: event,
  })
