import {
  array,
  boolean,
  color,
  disabled,
  event,
  number,
  oneOf,
  readOnly as readOnlyProp,
  string,
  toLabeledValues
} from '@react-form-builder/core'
import type {TypeAttributes} from 'rsuite/esm/internals/types'

type Placement = TypeAttributes.Placement;

export const nonNegNumber = number.withEditorProps({min: 0})

export const positiveNumber = number.withEditorProps({min: 1})

export const placement = oneOf<Placement>(
  'bottomStart',
  'bottomEnd',
  'topStart',
  'topEnd',
  'leftStart',
  'rightStart',
  'leftEnd',
  'rightEnd'
)

export const size = oneOf(
  'xs',
  'sm',
  'md',
  'lg'
).labeled(
  'Extra small',
  'Small',
  'Medium',
  'Large'
).default('md')
  .withEditorProps({creatable: false})

export const backgroundColor = color.named('Background')

export const textStyles = {
  textAlign: oneOf('start', 'center', 'end')
    .default('start')
    .radio()
    .hinted('Text alignment'),
  fontSize: nonNegNumber.default(14).hinted('Font size'),
  fontWeight: oneOf('lighter', 'normal', 'bold').default('normal'),
  color: color,
}

export const readOnly = readOnlyProp.hinted('Read only component').default(false)
export const inputProps = {
  placeholder: string.hinted('Input placeholder'),
  size,
  disabled: disabled.hinted('Disabled component').default(false),
  readOnly,
  onChange: event,
}

export const headerSize = oneOf('h1', 'h2', 'h3', 'h4', 'h5', 'h6')
  .default('h4')
  .hinted('Header level')
  .withEditorProps({creatable: false})

export const navProps = {
  activeKey: string.hinted('Active key, corresponding to one of items value').default('Item1'),
  appearance: oneOf('default', 'tabs', 'subtle', 'pills')
    .default('default')
    .hinted('A navigation can have different appearances')
    .withEditorProps({creatable: false}),
  items: array.default(toLabeledValues(['Item1', 'Item2', 'Item3'])),
  justified: boolean.hinted('Justified navigation').default(false),
  onSelect: event,
  reversed: boolean.hinted('Reverse direction of tabs/subtle').default(false),
  vertical: boolean.hinted('Stacked navigation').default(false)
}

export const pickerProps = {
  label: string,
  value: string.valued,
  placeholder: string,
  placement,
  size,
  data: array,
  cleanable: boolean.default(true),
  creatable: boolean.default(false),
  disabled: disabled.default(false),
  readOnly,
  groupBy: string.default(''),
  disableVirtualized: boolean,
  onLoadData: event,
  onSelect: event,
  onClean: event,
  onClose: event,
  onCreate: event,
  onChange: event,
  onSearch: event,
}

export const controlColor = oneOf('red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'violet')
  .withEditorProps({creatable: false})
