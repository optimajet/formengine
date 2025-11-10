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

export const textStyles = {
  textAlign: oneOf('start', 'center', 'end')
    .default('start')
    .radio(),
  fontSize: nonNegNumber.default(14),
  fontWeight: oneOf('lighter', 'normal', 'bold').default('normal'),
  color,
}

export const readOnly = readOnlyProp.default(false)

export const inputProps = {
  placeholder: string,
  size,
  disabled: disabled.default(false),
  readOnly,
  onChange: event,
}

export const headerSize = oneOf('h1', 'h2', 'h3', 'h4', 'h5', 'h6')
  .default('h4')
  .withEditorProps({creatable: false})

export const navProps = {
  activeKey: string.default('Item1'),
  appearance: oneOf('default', 'tabs', 'subtle', 'pills')
    .default('default')
    .withEditorProps({creatable: false}),
  items: array.default(toLabeledValues(['Item1', 'Item2', 'Item3'])),
  justified: boolean.default(false),
  onSelect: event,
  reversed: boolean.default(false),
  vertical: boolean.default(false)
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
