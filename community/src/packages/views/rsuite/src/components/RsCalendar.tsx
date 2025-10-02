import {boolean, date, define, event, string} from '@react-form-builder/core'
import {Calendar} from 'rsuite'
import type {CalendarProps} from 'rsuite/esm/Calendar/Calendar'
import {readOnly} from '../commonProperties'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'

/**
 * Props for the RsCalendar component.
 */
export interface RsCalendarProps extends CalendarProps {
  /**
   * Whether the calendar is read only.
   */
  readOnly: boolean
  /**
   *  Label for the calendar.
   */
  label?: string
}

/**
 * Calendar component with label support.
 * @param props the component props.
 * @param props.label the label for the calendar.
 * @param props.style the CSS styles.
 * @param props.className the CSS class name.
 * @param props.props the additional calendar props.
 * @returns the React element.
 */
const RsCalendar = ({label, style, className, ...props}: RsCalendarProps) => {
  return <Labeled label={label} style={style} className={className} passAriaToChildren={true}>
    {
      props.readOnly
        ? <Calendar {...props} onChange={undefined}/>
        : <Calendar {...props}/>
    }
  </Labeled>
}

export const rsCalendar = define(RsCalendar, 'RsCalendar')
  .name('Calendar')
  .category(fieldsCategory)
  .props({
    label: string,
    bordered: boolean.hinted('Show border').default(false),
    compact: boolean.hinted('Display a compact calendar').default(false),
    defaultValue: date.hinted('Default value'),
    readOnly,
    isoWeek: boolean.hinted('ISO 8601 standard, each calendar week begins on Monday and Sunday on the seventh day').default(false),
    onChange: event.hinted('Callback fired before the value changed'),
    onSelect: event.hinted('Callback fired before the date selected'),
    value: date.valued.hinted('Controlled value'),
  })
