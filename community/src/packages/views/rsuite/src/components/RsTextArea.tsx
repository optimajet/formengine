import {define, disabled, event, string} from '@react-form-builder/core'
import type {InputProps} from 'rsuite'
import {Input} from 'rsuite'
import {positiveNumber, readOnly, size} from '../commonProperties'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'

/**
 * Props for the RsTextArea component.
 */
export interface RsTextAreaProps extends InputProps {
  /**
   * The label for the text area.
   */
  label: string
  /**
   * The number of visible text lines.
   */
  rows: number
  /**
   * The htmlSize attribute defines the width of the &laquo;input> element.
   */
  htmlSize?: number
}

/**
 * A text area component for multi-line text input.
 * @param props the component props.
 * @param props.style the CSS style for the component.
 * @param props.className the CSS class name for the component.
 * @param props.label the label for the text area.
 * @returns the React element.
 */
const RsTextArea = ({style, className, label, ...props}: RsTextAreaProps) => (
  <Labeled label={label} style={style} className={className} passAriaToChildren={true}>
    <Input as="textarea" {...props}/>
  </Labeled>
)

export const rsTextArea = define(RsTextArea, 'RsTextArea')
  .name('Text area')
  .category(fieldsCategory)
  .props({
    label: string.default('Text area'),
    value: string.default('').valued,
    placeholder: string,
    rows: positiveNumber.default(5),
    size,
    disabled: disabled.hinted('Disabled component').default(false),
    readOnly,
    onChange: event,
    onPressEnter: event
  })
