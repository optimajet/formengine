import type {ComponentData, Store} from '@react-form-builder/core'
import {ComponentStore} from '@react-form-builder/core'
import {InputCell} from '../components/InputCell'
import {RsWizardStepComponentType} from './RsWizardStep'

type LabelValue = { label: string }

/**
 * Creates a component store containing the Wizard step.
 * @param index the step index.
 * @returns the component store containing the Wizard step.
 */
export const createStep = (index: number) => {
  const componentStore = new ComponentStore(`step${index}`, RsWizardStepComponentType)
  componentStore.props.label = {value: `Step ${index}`}
  return componentStore
}

export const editorProps = {
  onAdd: (index: number, wizardComponentData: ComponentData, viewerStore: Store) => {
    const componentStore = createStep(index + 1)
    const componentData = viewerStore.createComponentData(componentStore)
    const activeIndex = wizardComponentData.store.props.activeIndex ??= {}
    activeIndex.value = index
    if (wizardComponentData.children?.length) {
      wizardComponentData.children[index - 1]?.insertAfterMe(componentData)
      return
    }
    componentData.setParent(wizardComponentData)
  },
  onRemove: (index: number, wizardComponentData: ComponentData) => {
    const {activeIndex} = wizardComponentData.store.props
    if (activeIndex?.value === index && index > 0) {
      activeIndex.value = index - 1
    }
    wizardComponentData.children[index].delete()
  },
  columns: [{name: 'label', input: InputCell}],
  calculateEditorProps: ({store}: ComponentData) => {
    const data = store.children?.map(({props}) => ({
      label: props.label?.value
    })) ?? []
    const handleChange = (labels: LabelValue[]) => {
      labels.forEach(({label}, index) => {
        if (!store.children?.[index]) return
        const {props} = store.children[index]
        props.label = {value: label}
      })
    }
    return {data, onChange: handleChange}
  }
}
