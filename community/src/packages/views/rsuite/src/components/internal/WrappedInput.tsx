import {useCallback} from 'react'
import type {InputProps} from 'rsuite'
import {Input} from 'rsuite'

/**
 * The React component that wraps the Input component.
 * @param props the React component properties.
 * @param props.onChange the onChange event of the Input.
 * @param props.props the other wrapped properties of the component.
 * @returns the React element.
 */
export const WrappedInput = ({onChange, ...props}: InputProps) => {
  const handleChange = useCallback((value: any, event: any) => onChange?.(event, value), [onChange])

  return <Input onChange={handleChange} {...props}/>
}
