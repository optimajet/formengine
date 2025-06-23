const templateTypeNamePrefix = 'Template:'

/**
 * Generates the template type name from the specified template name. **Internal use only.**
 * @param name the template name.
 * @returns the template type name.
 */
export function generateTemplateTypeName(name: string) {
  return templateTypeNamePrefix + name
}

/**
 * Extracts the template name from the specified component type name.
 * @param typeName the component type name.
 * @returns the template name.
 */
export function getTemplateName(typeName: string) {
  if (typeName.startsWith(templateTypeNamePrefix)) return typeName.slice(templateTypeNamePrefix.length)
  throw new Error(`Cannot determine template name from '${typeName}'`)
}

/**
 * Returns true if typeName is the template type, false otherwise.
 * @param typeName the type name.
 * @returns true if typeName is the template type, false otherwise.
 */
export function isTemplateType(typeName: string) {
  return typeName.startsWith(templateTypeNamePrefix)
}
