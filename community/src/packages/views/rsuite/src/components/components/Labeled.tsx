import {css} from '@emotion/react'
import styled from '@emotion/styled'
import {namedObserver, useAriaAttributes, useComponentData} from '@react-form-builder/core'
import type {ComponentProps} from 'react'
import {cloneElement} from 'react'

export const requiredStyle = css`
  margin-inline-start: 3px;
  content: "*";
  color: #f44336;
`

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  label {
    margin-inline-start: 5px;
    margin-bottom: 2px;
    text-align: left;
  }

  &.required > label::after {
    ${requiredStyle};
  }
`

interface LabeledProps extends ComponentProps<any> {
  label?: string,
  /**
   * If true, ARIA attributes will be passed automatically to children.
   */
  passAriaToChildren: boolean
}

/**
 * The React component that adds a label to a child component.
 * @param props the React component properties.
 * @param props.label the component label.
 * @param props.children the children component.
 * @param props.passAriaToChildren if true, ARIA attributes will be passed automatically to children.
 * @returns the React element.
 */
export const RawLabeled = ({label, children, passAriaToChildren, ...props}: LabeledProps) => {
  const {id} = useComponentData()
  const aria = useAriaAttributes({labeled: !!label})
  return <Container {...props} role="group">
    {label && <label id={aria['aria-labelledby']} htmlFor={id}>{label}</label>}
    {passAriaToChildren ? cloneElement(children, {id, ...aria}) : children}
  </Container>
}

export const Labeled = namedObserver('Labeled', RawLabeled)
