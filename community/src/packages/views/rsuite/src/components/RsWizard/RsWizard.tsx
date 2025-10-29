import {cx} from '@emotion/css'
import styled from '@emotion/styled'
import type {ComponentData} from '@react-form-builder/core'
import {
  array,
  boolean,
  ComponentStore,
  define,
  event,
  nodeArray,
  number,
  oneOf,
  string,
  useBuilderMode,
  useComponentData
} from '@react-form-builder/core'
import type {CSSProperties, PropsWithChildren} from 'react'
import {useCallback, useEffect, useMemo, useState} from 'react'
import type {StepItemProps} from 'rsuite'
import {Button, ButtonToolbar, Steps} from 'rsuite'
import {useArrayMapMemo} from '../../hooks'
import {structureCategory} from '../categories'
import {Rows} from '../components/Layout'
import {createStep, editorProps} from './editorProps'
import {eventListeners} from './eventListeners'
import {SItem} from './Item'
import {RsWizardStepComponentType} from './RsWizardStep'
import {WizardIcon} from './WizardIcon'

/**
 * Props for the RsWizard component.
 */
export interface RsWizardProps extends PropsWithChildren<any> {
  /**
   * Whether to show steps.
   */
  showSteps?: boolean
  /**
   * Whether to show step labels.
   */
  showStepsLabels?: boolean
  /**
   * Whether steps are vertical.
   */
  verticalSteps?: boolean
  /**
   * Navigation mode for steps.
   */
  stepsNavigation?: 'disable' | 'onlyVisited' | 'any'
  /**
   * Active step index.
   */
  activeIndex?: number
  /**
   * Label for previous button.
   */
  prevButtonLabel?: string
  /**
   * Label for next button.
   */
  nextButtonLabel?: string
  /**
   * Label for finish button.
   */
  finishButtonLabel?: string
  /**
   * Whether to validate on next.
   */
  validateOnNext: boolean,
  /**
   * Whether to validate on finish.
   */
  validateOnFinish: boolean,
  /**
   * Callback when step changes.
   */
  onChange?: (activeIndex?: number) => void
  /**
   * Callback when next button is clicked.
   */
  onNext?: () => void
  /**
   * Callback when previous button is clicked.
   */
  onPrev?: () => void
  /**
   * Callback when finish button is clicked.
   */
  onFinish?: () => void
}

const toolbarStyle = {justifyContent: 'end', zIndex: 7} as const

const Container = styled(Rows)`
  gap: 10px;
  padding: 10px;

  .parent-type-RsWizard.Toolbar {
    .add-button {
      display: none;
    }
  }
`

const SCentered = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
`

const EmptyContent = () => <SCentered>Missing content</SCentered>

/**
 * Props for wizard step item component.
 */
interface WizardStepItemProps {
  /**
   * Label for the step.
   */
  label?: string
  /**
   * CSS class name.
   */
  className: string
  /**
   * Status of the step.
   */
  status: StepItemProps['status']
  /**
   * Click handler for the step.
   */
  onClick: () => void
}

/**
 * Wizard component with step navigation and validation.
 * @param props the component props.
 * @param props.children the children components.
 * @param props.activeIndex the active step index.
 * @param props.onChange the callback when step changes.
 * @param props.onNext the callback when next button is clicked.
 * @param props.onPrev the callback when previous button is clicked.
 * @param props.onFinish the callback when finish button is clicked.
 * @param props.showSteps whether to show steps.
 * @param props.showStepsLabels whether to show step labels.
 * @param props.verticalSteps whether steps are vertical.
 * @param props.stepsNavigation the navigation mode for steps.
 * @param props.prevButtonLabel the label for previous button.
 * @param props.nextButtonLabel the label for next button.
 * @param props.finishButtonLabel the label for finish button.
 * @param props.validateOnNext whether to validate on next.
 * @param props.validateOnFinish whether to validate on finish.
 * @param props.props the additional wizard props.
 * @returns the React element.
 */
const RsWizard = ({
                    children,
                    activeIndex = 0,
                    onChange,
                    onNext,
                    onPrev,
                    onFinish,
                    showSteps,
                    showStepsLabels,
                    verticalSteps,
                    stepsNavigation,
                    prevButtonLabel,
                    nextButtonLabel,
                    finishButtonLabel,
                    validateOnNext,
                    validateOnFinish,
                    ...props
                  }: RsWizardProps) => {
  const [visited, setVisited] = useState(activeIndex)
  const isBuilderMode = useBuilderMode() === 'builder'

  useEffect(() => {
    if (visited < activeIndex) setVisited(activeIndex)
  }, [visited, activeIndex])

  const componentData = useComponentData()

  const labels = useArrayMapMemo(
    componentData.store.children,
    ({props}) => ({label: props.label?.value})
  )

  const openStep = useCallback((index: number) => {
    if (visited < index) setVisited(index)
    onChange?.(index)
  }, [visited, onChange])

  const handleFinish = useCallback(() => {
    if (validateOnFinish) {
      componentData.validate().then(() => {
        if (componentData.hasErrors) return
        onFinish?.()
      })
      return
    }
    onFinish?.()
  }, [componentData, onFinish, validateOnFinish])

  const handleNext = useCallback(() => {
    let newIndex = activeIndex ?? 0
    if (newIndex < labels.length) newIndex = newIndex + 1

    const child = componentData.children[activeIndex]
    if (validateOnNext) {
      child?.validate().then(() => {
        if (child?.hasErrors) return
        openStep?.(newIndex)
        onNext?.()
      })
      return
    }
    openStep?.(newIndex)
    onNext?.()
  }, [activeIndex, componentData.children, labels.length, onNext, openStep, validateOnNext])

  const handlePrev = useCallback(() => {
    let newIndex = activeIndex ?? 0
    if (newIndex > 0) newIndex = newIndex - 1
    openStep?.(newIndex)
    onPrev?.()
  }, [activeIndex, onPrev, openStep])

  const isStepAvailable = useCallback((index: number) => {
    return isBuilderMode || (
      stepsNavigation === 'any' || stepsNavigation === 'onlyVisited' && index <= visited
    )
  }, [visited, isBuilderMode, stepsNavigation])

  const getStepStatus = useCallback((index: number): StepItemProps['status'] => {
    return index <= visited ? 'process' : 'wait'
  }, [visited])

  const handleStepClick = useCallback((index: number) => {
    if (isStepAvailable(index)) openStep(index)
  }, [openStep, isStepAvailable])

  const isStart = activeIndex <= 0
  const isFinish = activeIndex >= labels.length - 1
  const disableNextButton = isFinish && finishButtonLabel === nextButtonLabel
  const stepsContainerStyle = useMemo<CSSProperties>(() => ({
    display: 'flex',
    flexDirection: verticalSteps ? 'row' : 'column',
    gap: 10
  }), [verticalSteps])

  const content = Array.isArray(children)
    ? children[activeIndex] ?? children[0]
    : null

  const buttons = useMemo(() => (
    <ButtonToolbar style={toolbarStyle} className={'buttons'}>
      {!isStart && <Button onClick={handlePrev} disabled={isStart}>{prevButtonLabel}</Button>}
      <Button onClick={isFinish ? handleFinish : handleNext} disabled={disableNextButton}
              appearance={'primary'}>
        {isFinish ? finishButtonLabel : nextButtonLabel}
      </Button>
    </ButtonToolbar>
  ), [disableNextButton, finishButtonLabel, handleFinish, handleNext, handlePrev, isFinish, isStart, nextButtonLabel, prevButtonLabel])

  const wizardItems: WizardStepItemProps[] = useMemo(() => {
    return labels.map(({label}, index) => {
      const className = cx({
        available: isStepAvailable(index),
        active: index === activeIndex
      })

      const onClick = () => handleStepClick(index)
      const status = getStepStatus(index)

      return {
        label,
        className,
        status,
        onClick,
      }
    })
  }, [activeIndex, getStepStatus, handleStepClick, isStepAvailable, labels])

  return <Container {...props}>
    <div style={stepsContainerStyle}>
      {showSteps && !!content &&
        <Steps current={activeIndex} vertical={verticalSteps} className={'steps'}>
          {wizardItems.map(({label, onClick, status, className}, index) => (
            <SItem
              key={index}
              title={showStepsLabels && label}
              onClick={onClick}
              status={status}
              className={className}
            />
          ))}
        </Steps>
      }
      <div className={'content'}>{content ?? <EmptyContent/>}</div>
    </div>
    {!!content && buttons}
  </Container>
}

/**
 * Component type for RsWizard.
 */
const RsWizardComponentType = 'RsWizard'

/**
 * Get initial json for wizard component.
 * @returns initial json string.
 */
const getInitialJson = () => {
  const componentStore = new ComponentStore(RsWizardComponentType, RsWizardComponentType)
  componentStore.children = [1, 2, 3].map(index => createStep(index))
  return JSON.stringify(componentStore)
}

export const rsWizard = define(RsWizard, RsWizardComponentType)
  .name('Wizard')
  .category(structureCategory)
  .icon(WizardIcon)
  .initialJson(getInitialJson())
  .eventListeners(eventListeners)
  .props({
    activeIndex: number
      .valued
      .default(0)
      .withEditorProps({
        calculateEditorProps: ({store}: ComponentData) => {
          const length = store.children?.length || 1
          return {
            min: 0,
            max: length - 1
          }
        }
      }),
    stepsNavigation: oneOf('disable', 'onlyVisited', 'any')
      .labeled('Disable', 'Only visited', 'Any')
      .default('onlyVisited')
      .withEditorProps({creatable: false}),
    steps: array
      .default([])
      .withEditorProps(editorProps),
    children: nodeArray
      .withInsertRestriction((_, child) => {
        return child.model.type === RsWizardStepComponentType
      }),
    prevButtonLabel: string.default('Previous'),
    nextButtonLabel: string.default('Next'),
    finishButtonLabel: string.default('Finish'),
    showSteps: boolean.default(true),
    showStepsLabels: boolean.default(true),
    verticalSteps: boolean.default(false),
    validateOnNext: boolean.default(true),
    validateOnFinish: boolean.default(true),
    onNext: event,
    onPrev: event,
    onFinish: event
  })
