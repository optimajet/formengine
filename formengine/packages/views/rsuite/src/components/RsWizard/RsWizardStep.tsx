import styled from '@emotion/styled'
import {containerStyles, define, node, string} from '@react-form-builder/core'
import {WizardStepIcon} from './WizardStepIcon'

interface RsWizardStepProps {
  label?: string
}

const RsWizardStep = styled.div<RsWizardStepProps>`
  display: flex;
`

const {flexDirection, gap} = containerStyles

export const RsWizardStepComponentType = 'RsWizardStep'

export const rsWizardStep = define(RsWizardStep, RsWizardStepComponentType)
  .name('Wizard step')
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
