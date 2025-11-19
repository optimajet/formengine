import type {LanguageFullCode} from './language'

/**
 * The format in which localization is stored.
 * @example
 * {
 *  "en-US": {
 *    "componentKey": {
 *      "property": "This {$value} is localized!"
 *    }
 *  }
 * }
 */
export type LocalizationValue = Record<LanguageFullCode, ComponentsLocalization>

/**
 * A record containing localizations grouped by component key.
 */
export type ComponentsLocalization = Record<ComponentKey, TypedLocalization>

/**
 * A record containing localizations grouped by localization type.
 */
export type TypedLocalization = Partial<Record<LocalizationType, ComponentPropsLocalization>>

/**
 * A record containing localizations for the component properties.
 */
export type ComponentPropsLocalization = Record<ComponentPropertyName, string>

/**
 * The component key.
 */
export type ComponentKey = string

/**
 * The component property name.
 */
export type ComponentPropertyName = string

/**
 * Represents the type of localization. The localization can be for a component, tooltip or for validator.
 */
export type LocalizationType = 'component' | 'tooltip' | 'modal' | string
