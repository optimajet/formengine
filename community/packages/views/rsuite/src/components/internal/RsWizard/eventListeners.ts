import type {ComponentData, ComponentMetadataEventListeners} from '@react-form-builder/core'

type CheckFunction = (parentComponentData: ComponentData) => boolean

/**
 * Finds the parent element with the necessary parameters.
 * @param componentData the target child.
 * @param checkFunction the checking function.
 * @returns returns the found componentData, otherwise undefined.
 */
const findParentWithParams = (componentData: ComponentData, checkFunction: CheckFunction): ComponentData | undefined => {
  if (checkFunction(componentData)) return componentData
  if (componentData.parent) {
    return findParentWithParams(componentData.parent, checkFunction)
  }
  return
}

export const eventListeners: ComponentMetadataEventListeners = {
  onSelectNode: (data: ComponentData, self: ComponentData) => {
    const parentWithParams = findParentWithParams(data, parent => parent?.parent === self)
    if (parentWithParams) {
      const stepIndex = self.children.indexOf(parentWithParams)
      if (stepIndex >= 0) self.field?.setValue(stepIndex)
    }
  }
}
