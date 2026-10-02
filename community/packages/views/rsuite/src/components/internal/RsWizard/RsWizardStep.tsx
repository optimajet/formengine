import {containerStyles, define, forwardRef, node, string} from '@react-form-builder/core'
import cx from 'clsx'
import type {ForwardedRef, PropsWithChildren} from 'react'
import {structureCategory} from '../../categories'
import styles from './RsWizardStep.module.css'
import {WizardStepIcon} from './WizardStepIcon'

/**
 * Props for the RsWizardStep component.
 */
export interface RsWizardStepProps extends PropsWithChildren<any> {
  /**
   * Label for the wizard step.
   */
  label?: string
  /**
   * className for element.
   */
  className?: string
}

/**
 * Wizard step component with flex layout.
 * @param props the component props.
 * @param props.className the CSS class name.
 * @param props.props the additional step props.
 * @param ref the forwarded ref to the step element.
 * @returns the React element.
 */
const RsWizardStep = forwardRef(({className, ...props}: RsWizardStepProps, ref: ForwardedRef<HTMLDivElement>) => {
  return <div {...props} ref={ref} className={cx(styles.step, className)} />
})

const {flexDirection, gap} = containerStyles

export const RsWizardStepComponentType = 'RsWizardStep'

export const rsWizardStep = define(RsWizardStep, RsWizardStepComponentType)
  .name('Wizard step')
  .category(structureCategory)
  .kind('container')
  .icon(WizardStepIcon)
  .disableToolbarAdd()
  .props({
    label: string.default('Step'),
    children: node,
  })
  .css({
    ...containerStyles,
    flexDirection: flexDirection.default('column'),
    gap: gap.default('10px'),
  })
  .insertRestriction((_, parent) => parent.model.type === 'RsWizard')
