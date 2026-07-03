/**
 * Executes a given function on each node of a tree. **Internal use only.**
 * @param tree the root node of the tree.
 * @param fn the function to be executed on each node of the tree.
 */
export function treeForEach<T extends { children?: T[] }>(tree: T, fn: (treeNode: T) => void) {
  fn(tree)
  tree.children?.forEach(child => treeForEach(child, fn))
}

/**
 * Finds the depth of a given element in a tree. **Internal use only.**
 * @param value the root of the tree.
 * @param element the element to find the depth of.
 * @param depth the current depth of the tree (optional, default is 0).
 * @returns the depth of the element in the tree, or undefined if the element is not found.
 */
export function findTreeElementDepth<T extends { children?: T[] }>(value: T, element?: T, depth = 0): number | undefined {
  if (value === element) return depth

  if (!value.children) return

  depth = depth + 1
  for (const child of value.children) {
    const childNode = findTreeElementDepth(child, element, depth)
    if (childNode) return childNode
  }
}
