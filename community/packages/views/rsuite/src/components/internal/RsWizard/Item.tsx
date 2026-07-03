import cx from 'clsx'
import type {ComponentProps} from 'react'
import {Steps} from 'rsuite'
import styles from './Item.module.css'

type StepItemProps = ComponentProps<typeof Steps.Item>

/**
 * The steps item.
 * @param props the component props.
 * @param props.className the CSS class name for the component.
 * @returns the React element.
 */
export const SItem = ({className, ...props}: StepItemProps) => {
  return <Steps.Item {...props} className={cx(styles.item, className)}/>
}
