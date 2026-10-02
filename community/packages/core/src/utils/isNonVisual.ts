import {cfNonVisual} from '../features/define/utils/integratedComponentFeatures'
import type {ComponentData} from './contexts/ComponentDataContext'
import {treeForEach} from './treeUtils'

/**
 * Returns true when the component is marked with the non-visual feature.
 * @param component the component data to check.
 * @returns true if the component is non-visual.
 */
export function isNonVisual(component: ComponentData): boolean {
  return component.model.isFeatureEnabled(cfNonVisual)
}

/**
 * Returns the visual children of the component (excludes non-visual nodes).
 * @param component the parent component.
 * @returns the visual child components.
 */
export function getVisualChildren(component: ComponentData): ComponentData[] {
  return component.children.filter(child => !isNonVisual(child))
}

/**
 * Returns the non-visual children of the component.
 * @param component the parent component.
 * @returns the non-visual child components.
 */
export function getNonVisualChildren(component: ComponentData): ComponentData[] {
  return component.children.filter(isNonVisual)
}

/**
 * Warns when non-visual components are nested under a non-root parent.
 * Non-visual instances must be direct children of the form root so {@link NonVisualHost} can mount them.
 * @param root the form component tree root.
 */
export function warnMisplacedNonVisualComponents(root: ComponentData): void {
  treeForEach(root, node => {
    if (node === root || !isNonVisual(node)) return
    if (node.parent === root) return
    console.warn(`Non-visual component "${node.key}" (${node.model.type}) must be a direct child of the root.`)
  })
}
