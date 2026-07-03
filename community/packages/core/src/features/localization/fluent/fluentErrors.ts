import {LocalizationError} from '../LocalizationError'

const FLUENT_OVERRIDE_WARNING = 'Attempt to override'

/**
 * Converts a Fluent bundle error to a {@link LocalizationError}.
 * @param error fluent error.
 * @returns localization error.
 */
export const convertFluentError = (error: Error): LocalizationError =>
  new LocalizationError(error.message, error.name)

/**
 * Logs fluent formatting errors and optionally missing property names.
 * @param errors errors to log.
 * @param missing missing property names.
 * @param logMissing when true, logs missing property names.
 */
export const logFluentErrors = (
  errors: Array<LocalizationError | Error>,
  missing?: string[],
  logMissing = false,
): void => {
  errors.forEach((e) => {
    if (e.name.includes(FLUENT_OVERRIDE_WARNING)) return
    console.warn(e)
  })

  if (logMissing && Array.isArray(missing) && missing.length > 0) {
    const missingProperties: Record<string, null> = {}
    missing.forEach(item => missingProperties[item] = null)
    console.warn('Missing properties:', Object.keys(missingProperties))
  }
}
