import cx from 'clsx'
import {Table} from 'rsuite'
import type {RowDataType} from 'rsuite-table/lib'
import type {InnerCellProps} from 'rsuite-table/lib/Cell'
import styles from './SCell.module.css'

const {Cell} = Table

type SCellProps = InnerCellProps<RowDataType, string | number>

/**
 * Styled table cell.
 * @param props the component props.
 * @param props.className the CSS class name.
 * @returns the React element.
 */
export const SCell = ({className, ...props}: SCellProps) => {
  return <Cell<RowDataType, string | number> {...props} className={cx(styles.cell, className)}/>
}
