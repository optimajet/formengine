import type {RuleValidator} from '../../validation'

/**
 * Returns true if the component key is unique across the entire component tree. **Internal use only.**
 * @param value the component key.
 * @param store the form viewer settings.
 * @returns true if the component key is unique across the entire component tree.
 */
export const isUniqueKey: RuleValidator<string> = (value, store) =>
  1 === store.reduceScreen((acc, cd) => cd.key === value ? acc + 1 : acc, 0)
