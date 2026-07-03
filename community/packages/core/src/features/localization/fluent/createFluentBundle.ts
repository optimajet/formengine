import {FluentBundle} from '@fluent/bundle'
import type {LanguageFullCode} from '../language'

/**
 * Wrapper around FluentBundle constructor with specific settings.
 * @param langFullCode Language full code ie 'en-US'.
 * @returns the message bundles.
 */
export const createFluentBundle = (langFullCode: LanguageFullCode): FluentBundle => {
  return new FluentBundle(langFullCode, {useIsolating: false})
}
