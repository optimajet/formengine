import {define, node} from '@react-form-builder/core'
import type {ReactNode} from 'react'
import {Col, Grid, Row} from 'rsuite'

interface RsGridProps {
  child1: ReactNode
  child2: ReactNode
}

const RsGrid = (props: RsGridProps) => {
  return (
    <Grid>
      <Row>
        {[].map(() => <Col></Col>)}
        <Col xs={12}>
          {props.child1}
        </Col>
        <Col xs={12}>
          {props.child2}
        </Col>
      </Row>
    </Grid>
  )
}

export const rsGrid = define(RsGrid, 'RsGrid')
  .name('Grid')
  .props({
    child1: node,
    child2: node,
  })
