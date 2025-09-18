import type {ComponentType} from 'react'
import type {ComponentTreeProps} from '../ComponentTreeProps'
import type {ComponentStore} from '../stores/ComponentStore'
import type {ComponentData, IComponentDataProvider} from './contexts/ComponentDataContext'
import {groupBy} from './groupBy'
import {needRender} from './needRender'

const fnCache = new Map<string, Function>()

function getOrCreateFn(source: string) {
  const fn = fnCache.get(source)
  if (fn) return fn

  const result = new Function('parentProps', source)
  fnCache.set(source, result)
  return result
}

/**
 * Performs the function of checking if the child component can be bound. **Internal use only.**
 * @param childStore the child component settings.
 * @param parentProps the parent component properties.
 * @returns true, if the child component can be bound, false otherwise.
 */
export function checkSlotCondition(childStore: ComponentStore, parentProps: any) {
  const fnSource = childStore.slotCondition?.trim()
  // it's OK - no condition to bind
  if (!fnSource) return true
  const fn = getOrCreateFn(fnSource)
  try {
    return fn(parentProps)
  } catch (e) {
    console.warn(e)
    return false
  }
}

const defaultContainerKey = 'children'

/**
 * Returns the {@link Record} with all child components. **Internal use only.**
 * @param data the parent component's data necessary to display the component.
 * @param componentTreeItem the type of React component that wraps child components.
 * @param componentProps the properties of the parent component.
 * @returns the {@link Record} with all child components.
 */
export function getChildren(
  data: ComponentData,
  componentTreeItem: ComponentType<ComponentTreeProps>,
  componentProps: Record<string, any>
) {
  const containers = data.field?.fieldType === 'repeater'
    ? (data.field as unknown as IComponentDataProvider).componentData
    : data.children
  const ComponentTree = componentTreeItem
  const currentProps: Record<string, any> = {}

  const groups = groupBy(containers, value => value.store.slot || defaultContainerKey)
  const isSlotConditionSatisfied = (child: ComponentData) => checkSlotCondition(child.store, componentProps)
  const isNeedRender = (child: ComponentData) => needRender(child.store, data.dataRoot)

  for (const [key, children] of Object.entries(groups)) {
    const filteredChildren = children
      .filter(isSlotConditionSatisfied)
      .filter(isNeedRender)

    if (filteredChildren.length) {
      currentProps[key] = data.model.propsBindingTypes[key] === 'array'
        ? filteredChildren.map(item => [item])
          .map((data, index) => <ComponentTree key={index} data={data}/>)
        : <ComponentTree data={filteredChildren}/>
    }
  }

  return currentProps
}
