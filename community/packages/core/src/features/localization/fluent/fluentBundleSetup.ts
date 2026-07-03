import type {FluentBundle} from '@fluent/bundle'
import {FluentResource} from '@fluent/bundle'
import type {IForm} from '../../../stores/IForm'
import type {LanguageFullCode} from '../language'
import type {LocalizationError} from '../LocalizationError'
import type {LocalizationBundleSetup} from './componentLocalizationContext'
import {createFluentBundle} from './createFluentBundle'
import {convertFluentError, logFluentErrors} from './fluentErrors'
import {objectToFluentResource} from './fluentResource'

/**
 * Adds localization items to a fluent bundle.
 * @param bundle target bundle.
 * @param items localization items.
 * @param options add-resource options.
 * @param options.allowOverrides when true, allows overriding existing message ids in the bundle.
 * @returns localization errors from fluent.
 */
const addItemsToFluentBundle = (
  bundle: FluentBundle,
  items: Record<string, unknown>,
  options?: { allowOverrides?: boolean },
): Array<LocalizationError> => {
  const source = objectToFluentResource(items)
  const resource = new FluentResource(source)
  const errors = bundle.addResource(resource, options)
  return errors.map(convertFluentError)
}

/**
 * Populates a fluent bundle with localization items and collects errors.
 * @param items localization items to add.
 * @param errors the array to collect any localization errors.
 * @param targetBundle fluent bundle to populate.
 * @returns the populated fluent bundle.
 */
export const populateFluentBundle = (
  items: Record<string, unknown>,
  errors: Array<LocalizationError>,
  targetBundle: FluentBundle,
): FluentBundle => {
  const fluentErrors = addItemsToFluentBundle(targetBundle, items)
  errors.length = 0
  errors.push(...fluentErrors)
  logFluentErrors(errors)
  return targetBundle
}

/**
 * Caches fluent bundles per locale for {@link addMessages} and related APIs.
 */
export class FluentBundleCache {
  readonly #bundles = new Map<string, FluentBundle>()

  /**
   * Returns an existing bundle for the locale or creates and caches a new one.
   * @param languageFullCode the full language code.
   * @returns the fluent bundle for the locale.
   */
  getOrCreate(languageFullCode: LanguageFullCode): FluentBundle {
    const bundle = this.#bundles.get(languageFullCode) ?? createFluentBundle(languageFullCode)
    this.#bundles.set(languageFullCode, bundle)
    return bundle
  }

  /**
   * Adds messages to the cached bundle for the locale.
   * @param locale the locale for the messages.
   * @param messages the messages to add.
   * @param options add-resource options.
   * @param options.allowOverrides when true, allows overriding existing message ids in the bundle.
   * @returns localization errors from fluent.
   */
  addMessages(
    locale: LanguageFullCode,
    messages: Record<string, unknown>,
    options?: { allowOverrides?: boolean },
  ): Array<LocalizationError> {
    return addItemsToFluentBundle(this.getOrCreate(locale), messages, options)
  }
}

/**
 * Prepares fluent bundles for the requested and default form languages.
 * Uses a fresh bundle per call so resolution reflects the latest localization store state.
 * @param form the form containing localization data.
 * @param requestedFullCode the requested language full code.
 * @param errors the array to collect any localization errors.
 * @returns fluent bundles and item maps for resolution.
 */
export const setupLocalizationBundles = (
  form: IForm,
  requestedFullCode: LanguageFullCode,
  errors: Array<LocalizationError>,
): LocalizationBundleSetup => {
  const defaultFullCode = form.defaultLanguage.fullCode
  const defaultItemsRaw = defaultFullCode !== requestedFullCode
    ? form.localization.getItems(defaultFullCode)
    : undefined
  const formItemsRaw = form.localization.getItems(requestedFullCode)
  const defaultItems = defaultItemsRaw ?? undefined
  const formItems = formItemsRaw ?? undefined

  const defaultBundle = defaultItems
    ? populateFluentBundle(defaultItems, errors, createFluentBundle(defaultFullCode))
    : undefined
  const formBundle = formItems
    ? populateFluentBundle(formItems, errors, createFluentBundle(requestedFullCode))
    : undefined

  return {defaultBundle, defaultItems, formBundle, formItems}
}
