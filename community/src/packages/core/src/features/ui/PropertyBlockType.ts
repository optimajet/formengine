/**
 * Represents the type of property block.
 */
export type PropertyBlockType = 'component' | 'tooltip' | 'modal' | string

const validatorBlockPrefix = 'validator-'

/**
 * Retrieves the property block type for a given rule key. **Internal use only.**
 * @param ruleKey the rule key.
 * @returns the property block type. Validator property block types are prefixed with 'validator-'.
 */
export const getValidatorPropertyBlockType = (ruleKey: string): PropertyBlockType => {
  return `${validatorBlockPrefix}${ruleKey}`
}

/**
 * Determines if the given type is a validator property block type. **Internal use only.**
 * @param type the type to be checked.
 * @returns the boolean value indicating if the type is a validator property block type.
 */
export const isValidatorPropertyBlockType = (type: PropertyBlockType): boolean => {
  return type.startsWith(validatorBlockPrefix)
}
