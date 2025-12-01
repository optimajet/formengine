import styled from '@emotion/styled'
import {Table} from 'rsuite'
import type {RowDataType} from 'rsuite-table/lib'

const {Cell} = Table

export const SCell = styled(Cell<RowDataType, string | number>)`
  padding: 0;

  & .rs-table-cell-content {
    padding: 9px 3px;
  }
`
