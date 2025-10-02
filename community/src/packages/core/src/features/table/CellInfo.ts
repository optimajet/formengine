/**
 * The data key type.
 */
export type DataKeyType = string | number | symbol

/**
 * The information about a cell.
 */
export type CellInfo = {
  /**
   * The data key.
   */
  dataKey?: DataKeyType
  /**
   * The row index.
   */
  rowIndex?: number
  /**
   * The row data.
   */
  rowData?: Record<DataKeyType, unknown>
}
