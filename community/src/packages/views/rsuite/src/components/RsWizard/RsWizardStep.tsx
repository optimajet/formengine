import styled from '@emotion/styled'
import {containerStyles, define, node, string} from '@react-form-builder/core'
import {structureCategory} from '../categories'
import {WizardStepIcon} from './WizardStepIcon'

/**
 * Props for the RsWizardStep component.
 */
export interface RsWizardStepProps {
  /**
   * Label for the wizard step.
   */
  label?: string
}

/**
 * Wizard step component with flex layout.
 * @param props the component props.
 * @param props.label the label for the wizard step.
 * @param props.props the additional step props.
 * @returns the React element.
 */
const RsWizardStep = styled.div<RsWizardStepProps>`
  display: flex;
`

const {flexDirection, gap} = containerStyles

export const RsWizardStepComponentType = 'RsWizardStep'

export const rsWizardStep = define(RsWizardStep, RsWizardStepComponentType)
  .name('Wizard step')
  .category(structureCategory)
  .kind('container')
  .icon(WizardStepIcon)
  .props({
    label: string.default('Step'),
    children: node.hinted('Component children')
  })
  .css({
    ...containerStyles,
    flexDirection: flexDirection.default('column'),
    gap: gap.default('10px')
  })
  .insertRestriction((_, parent) => parent.model.type === 'RsWizard')
