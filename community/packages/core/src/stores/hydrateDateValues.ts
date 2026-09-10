import type {Model} from '../features/define/utils/Model'
import {coerceIfDate} from '../features/validation/utils/coerceIfDate'
import {getValidationRuleDefinition} from '../features/validation/utils/getValidationRuleDefinition'
import type {ComponentStore} from './ComponentStore'
import type {FormViewerValidationRules} from './FormViewerValidationRules'

/**
 * Restores Date instances lost when a form is deserialized from JSON.
 * Converts date-typed component properties and date-typed validation rule arguments.
 * @param componentStore the component settings loaded from JSON.
 * @param model the component metadata for the form viewer.
 * @param validationRules the validators for the component value type, if the component has a value type.
 */
export function hydrateDateValues(
  componentStore: ComponentStore,
  model: Model,
  validationRules?: FormViewerValidationRules
): void {
  model.dateProperties.forEach(property => {
    const componentProperty = componentStore.props?.[property]
    if (!componentProperty) return
    componentProperty.value = coerceIfDate('date', componentProperty.value)
  })

  const validations = componentStore.schema?.validations
  if (!validationRules || !validations) return

  validations.forEach(validation => {
    const params = getValidationRuleDefinition(validationRules, validation)?.definition.params
    const args = validation.args
    if (!params || !args) return

    params.forEach(param => {
      if (!(param.key in args)) return
      args[param.key] = coerceIfDate(param.type, args[param.key])
    })
  })
}
