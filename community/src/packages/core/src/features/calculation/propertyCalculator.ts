import type {ComponentProperty, ComponentStore} from '../../stores/ComponentStore'
import {isFunctionalProperty} from '../../stores/ComponentStore'
import {CalculableResult} from '../../utils/CalculableResult'
import type {IFormData} from '../../utils/IFormData'
import {isUndefined} from '../../utils/tools'

const fnCache = new Map<string, Function>()

const getOrCreateFn = (source: string) => {
  const fn = fnCache.get(source)
  if (fn) return fn

  const result = new Function('form', source)
  fnCache.set(source, result)
  return result
}

const calculateValue = (fnSource: string, formViewerData: IFormData) => {
  try {
    const fn = getOrCreateFn(fnSource)
    const result = fn(formViewerData)
    return CalculableResult.success(result)
  } catch (e) {
    return CalculableResult.error([
      e as Error,
      {
        name: 'Function source',
        message: fnSource
      }
    ])
  }
}

/**
 * Calculates the value for the component property. **Internal use only.**
 * @param componentProperty the component property.
 * @param formViewerData the formViewerData data.
 * @returns the calculated value.
 * @internal
 */
export const calculatePropertyValue = (componentProperty: ComponentProperty, formViewerData: IFormData) => {
  return calculateValue(componentProperty.fnSource || '', formViewerData)
}

/**
 * Calculates the value for the component property or calculates the value from the property expression.
 * @param componentProperty the component property.
 * @param formViewerData the formViewerData data.
 * @returns the calculated value.
 * @internal
 */
export const calculateExpressionProperty = (componentProperty: ComponentProperty, formViewerData: IFormData) => {
  if (isFunctionalProperty(componentProperty)) return calculatePropertyValue(componentProperty, formViewerData).result
  const fnSource = componentProperty.value || ''
  return calculateValue(`return ${fnSource}`, formViewerData).result
}

/**
 * The result of compiling of anything. **Internal use only.**
 */
export interface BaseCompilationResult {
  /**
   * Flag if true - compilation failed, false otherwise.
   */
  error: boolean
  /**
   * The array of compilation errors.
   */
  exceptions?: Error[]
}

/**
 * Calculates all properties for the component.
 * @param componentStore the component.
 * @param formViewerData the formViewerData data.
 * @returns the {@link Record}<string, any> for all component properties.
 * @internal
 */
export const calculateProperties = (componentStore: ComponentStore, formViewerData: IFormData) => {
  const data: Record<string, any> = {}
  Object.keys(componentStore.props).forEach(value => {
    const componentProperty = componentStore.props[value]
    if (!componentProperty) return

    if (isFunctionalProperty(componentProperty)) {
      const {result, error, exceptions} = calculatePropertyValue(componentProperty, formViewerData)
      if (error) {
        const message = `Error in the calculable field '${value}' of the '${componentStore.key}' component `
        console.warn(message, exceptions)
        return
      }
      data[value] = result
      return
    }

    // we do not want to set an undefined value, instead the default component property will be used
    if (!isUndefined(componentProperty.value)) {
      data[value] = componentProperty.value
    }
  })
  return data
}
