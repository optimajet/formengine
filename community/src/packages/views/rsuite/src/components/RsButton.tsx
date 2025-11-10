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
    active: boolean.default(false),
    appearance: oneOf('default', 'primary', 'link', 'subtle', 'ghost')
      .default('default')
      .withEditorProps({creatable: false}),
    children: string.required.default(defaultContent).dataBound,
    color: controlColor,
    disabled: disabled.default(false),
    href: string,
    loading: boolean.default(false),
    size,
    onClick: event,
  })
