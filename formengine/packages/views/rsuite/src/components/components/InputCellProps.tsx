import type {InnerCellProps} from 'rsuite-table/lib/Cell'
import type {RowDataType} from 'rsuite-table/lib'

/**
 * React component properties for the {@link InputCell} component.
 */
export interface InputCellProps extends InnerCellProps<RowDataType, string | number> {
  /**
   * The callback function called when the data in a cell is changed.
   * @param value the value.
   * @param dataKey the cell data key.
   * @param rowIndex the cell row index.
   */
  onChange?: (value?: any, dataKey?: string, rowIndex?: number) => void
  /**
   * The cell data key.
   */
  dataKey: string
  /**
   * Rows data.
   */
  rowData: RowDataType
}
