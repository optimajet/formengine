import {useCallback} from 'react'
import {Checkbox} from 'rsuite'
import styles from './CheckCell.module.css'
import type {InputCellProps} from './InputCellProps'
import {SCell} from './SCell'

/**
 * The React component that displays the table cell with the checkbox.
 * @param props the React component properties.
 * @param props.rowData the row data.
 * @param props.dataKey the key name in {@link props.rowData}.
 * @param props.rowIndex the row index.
 * @param props.onChange the onChange event of the checkbox.
 * @param props.props the other properties of the component.
 * @returns the React element.
 */
export const CheckCell = ({rowData, dataKey, rowIndex, onChange, ...props}: InputCellProps) => {
  const handleChange = useCallback((_: unknown, checked: boolean) => {
    // eslint-disable-next-line react-hooks/immutability
    rowData[dataKey] = checked
    onChange?.(checked, dataKey, rowIndex)
  }, [dataKey, onChange, rowData, rowIndex])

  return (
    <SCell {...props}>
      <Checkbox
        inline
        checked={rowData[dataKey] ?? false}
        onChange={handleChange}
        className={styles.checkbox}
      />
    </SCell>
  )
}
