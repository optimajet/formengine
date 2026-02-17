import type {InputWrapperProps} from '@mantine/core'
import {Input} from '@mantine/core'
import type {TimeGridProps} from '@mantine/dates'
import {getTimeRange, TimeGrid} from '@mantine/dates'
import {array, boolean, define, oneOf, required, string} from '@react-form-builder/core'
import {datesCategory} from './internal/categories'
import {description, label, onChange, size} from './internal/sharedProps'

/**
 * Props for the MtTimeGrid component.
 */
export interface MtTimeGridProps
  extends Omit<TimeGridProps, 'data'>,
    Omit<InputWrapperProps, 'children' | keyof TimeGridProps> {
  /**
   * Time values to render in 24h format.
   */
  data?: string[]

  /**
   * Start time in "HH:mm" format
   */
  startTime?: string

  /**
   * End time in "HH:mm" format
   */
  endTime?: string
}

const simpleGridProps = {
  type: 'container',
  cols: {base: 1, '180px': 2, '320px': 3},
  spacing: 'xs',
} as const

/**
 * Mantine time grid component for React Form Builder.
 * @param props component properties.
 * @returns time grid component.
 */
export function MtTimeGrid(props: MtTimeGridProps) {
  const {
    label,
    description,
    error,
    id,
    required,
    withAsterisk,
    data,
    startTime,
    endTime,
    ...others
  } = props

  const timeData = data && data.length > 0
    ? data
    : getTimeRange({
      startTime: startTime || '00:00',
      endTime: endTime || '23:59',
      interval: '01:00',
    })

  return (
    <Input.Wrapper
      label={label}
      description={description}
      error={error}
      id={id}
      required={required}
      withAsterisk={withAsterisk}
    >
      <TimeGrid
        data={timeData}
        simpleGridProps={simpleGridProps}
        {...others}
      />
    </Input.Wrapper>
  )
}

export const mtTimeGrid = define(MtTimeGrid, 'MtTimeGrid')
  .category(datesCategory)
  // TODO FE-1803 add support for simpleGridProps.
  .props({
    label: label,
    description: description,
    error: string,
    value: string.valued,
    onChange: onChange,
    size: size,
    radius: string,
    format: oneOf('12h', '24h').default('24h'),
    data: array,
    withSeconds: boolean.default(false),
    allowDeselect: boolean.default(false),
    disabled: boolean.default(false),
    minTime: string,
    maxTime: string,
    startTime: string.default('00:00'),
    endTime: string.default('23:59'),
    withAsterisk: required,
  })
