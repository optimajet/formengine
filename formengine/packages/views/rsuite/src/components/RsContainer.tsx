import styled from '@emotion/styled'
import {containerStyles, define, disabled, node, readOnly} from '@react-form-builder/core'
import type {ReactNode} from 'react'

const SDiv = styled.div`
  display: flex;
`
const {flexDirection, gap} = containerStyles

interface RsContainerProps {
  disabled?: boolean
  readOnly?: boolean
  children?: ReactNode
}

const RsContainer = (props: RsContainerProps) => {
  const {disabled, readOnly, ...otherProps} = props
  return <SDiv {...otherProps} />
}

export const rsContainer = define(RsContainer, 'RsContainer')
  .name('Container')
  .kind('container')
  .props({
    children: node.hinted('Component children'),
    disabled: disabled,
    readOnly: readOnly,
  })
  .css({
    ...containerStyles,
    flexDirection: flexDirection.default('column'),
    gap: gap.default('10px')
  })
