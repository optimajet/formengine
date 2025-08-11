/**
 * A component feature defining a component's characteristic.
 */
export type ComponentFeature = {
  /**
   * The component feature name.
   */
  name: string

  /**
   * Flag, if true the feature can contain multiple values, false otherwise.
   */
  allowMultiple: boolean
}

/**
 * The component features.
 */
export type ComponentFeatures = Record<string, unknown>

const componentFeatureRegistry: Record<string, ComponentFeature> = {}

/**
 * Registers the component feature in the component feature registry.
 * @param feature the component feature.
 * @throws the Error if the component feature is already registered.
 */
export function registerComponentFeature(feature: ComponentFeature) {
  const key = feature.name

  if (componentFeatureRegistry[key]) {
    throw new Error(`Component feature ${key} is already registered`)
  }

  componentFeatureRegistry[key] = feature
}

/**
 * Registers the boolean component feature in the component feature registry.
 * @param name the component feature name.
 */
export function registerBooleanComponentFeature(name: string) {
  registerComponentFeature({
    name,
    allowMultiple: false,
  })
}

/**
 * Returns the component feature from the component feature registry by the component feature name.
 * @param name the component feature name.
 * @returns the component feature from the component feature registry by the component feature name.
 * @throws the Error if the component feature is not registered.
 */
export function getComponentFeature(name: string) {
  const result = componentFeatureRegistry[name]

  if (!result) {
    throw new Error(`ComponentFeature ${name} is not registered`)
  }

  return result
}

/**
 * Adds a new value or updates an existing value in the component features record.
 * @param features the component features record.
 * @param name the feature name.
 * @param value the feature value.
 * @returns the modified component features record.
 */
export function addOrUpdateFeature(features: ComponentFeatures, name: string, value: unknown): ComponentFeatures {
  const feature = getComponentFeature(name)
  const result = {...features}
  const item: any = result[name]

  result[name] = feature.allowMultiple
    ? (item ? [...item, value] : [value])
    : value
  return result
}

/**
 * Adds a new values or updates an existing values in the component features record.
 * @param features the component features.
 * @param values the component feature values.
 * @returns the modified component features.
 */
export function addOrUpdateFeatures(features: ComponentFeatures,
                                    ...values: Array<{ name: string, value: unknown }>): ComponentFeatures {
  let result = features ?? {}
  values.forEach(item => {
    result = addOrUpdateFeature(result, item.name, item.value)
  })
  return result
}
