import {boolean, define, disabled, event, oneOf, string} from '@react-form-builder/core'
import {Button} from 'rsuite'
import {controlColor, readOnly, size} from '../commonProperties'

export const rsButton = define(Button, 'RsButton')
  .name('Button')
  .props({
    active: boolean.hinted('A button can show it is currently the active user selection').default(false),
    appearance: oneOf('default', 'primary', 'link', 'subtle', 'ghost')
      .default('default')
      .hinted('A button can have different appearances'),
    children: string.required.named('Content').default('Button').dataBound,
    color: controlColor,
    disabled: disabled.hinted('A button can show it is currently unable to be interacted with').default(false),
    readOnly,
    href: string.hinted('Providing a href will render an <a> element'),
    loading: boolean.hinted('A button can show a loading indicator').default(false),
    size,
    onClick: event,
    //onMouseOver: event,
    //onMouseLeave: event,
  })
