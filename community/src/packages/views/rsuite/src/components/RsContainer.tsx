import styled from '@emotion/styled'
import {containerStyles, define, disabled, node, readOnly} from '@react-form-builder/core'
import type {ReactNode} from 'react'
import {structureCategory} from './categories'

const SDiv = styled.div`
  display: flex;
`
const {flexDirection, gap} = containerStyles

/**
 * Props for the RsContainer component.
 */
export interface RsContainerProps {
  /**
   * Whether the container is disabled.
   */
  disabled?: boolean
  /**
   * Whether the container is read only.
   */
  readOnly?: boolean
  /**
   * Children elements of the container.
   */
  children?: ReactNode
}

/**
 * Container component with flex layout.
 * @param props the component props.
 * @returns the React element.
 */
const RsContainer = (props: RsContainerProps) => {
  const {disabled, readOnly, ...otherProps} = props
  return <SDiv {...otherProps} />
}

export const rsContainer = define(RsContainer, 'RsContainer')
  .name('Container')
  .category(structureCategory)
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
