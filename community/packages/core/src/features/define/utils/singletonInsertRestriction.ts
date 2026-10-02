import type {ComponentData} from '../../../utils/contexts/ComponentDataContext'
import {treeForEach} from '../../../utils/treeUtils'
import type {InsertRestrictionFn} from './InsertRestrictionFn'

/**
 * Returns true when another component of the same type already exists under the root.
 * @param root the form component tree root.
 * @param component the component being checked.
 * @returns true when another instance of the same type exists, false otherwise.
 */
export function hasOtherInstanceOfType(root: ComponentData, component: ComponentData): boolean {
  let exists = false
  treeForEach(root, node => {
    if (node.model.type === component.model.type && node.key !== component.key) {
      exists = true
    }
  })
  return exists
}

/**
 * Builds an insert restriction that allows at most one instance of the component type on the form.
 * @param existing the optional user-defined insert restriction to compose with.
 * @returns the singleton insert restriction.
 */
export function createSingletonInsertRestriction(existing?: InsertRestrictionFn): InsertRestrictionFn {
  return (self, target, slot) => {
    if (hasOtherInstanceOfType(target.root, self)) {
      return false
    }
    return existing?.(self, target, slot) ?? true
  }
}
