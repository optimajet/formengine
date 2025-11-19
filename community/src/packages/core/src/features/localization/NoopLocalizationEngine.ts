import {globalDefaultLanguage} from './default'
import type {ILocalizationEngine} from './ILocalizationEngine'
import type {LanguageFullCode} from './language'

/**
 * A no-operation localization engine that provides empty implementations.
 * Used when localization is not needed or as a fallback.
 */
export class NoopLocalizationEngine implements ILocalizationEngine {
  #locale: LanguageFullCode

  /**
   * @inheritDoc
   */
  constructor(locale?: LanguageFullCode) {
    this.#locale = locale ?? globalDefaultLanguage.fullCode
  }

  /**
   * @inheritDoc
   */
  set language(locale: LanguageFullCode) {
    this.#locale = locale
  }

  /**
   * @inheritDoc
   */
  get language() {
    return this.#locale
  }

  /**
   * @inheritDoc
   */
  addMessages() {
    return []
  }

  /**
   * @inheritDoc
   */
  getCompatibleId(rawId: string) {
    return rawId
  }

  /**
   * @inheritDoc
   */
  localizeProperties() {
    return {}
  }

  /**
   * @inheritDoc
   */
  localizeErrorMessage() {
    return undefined
  }
}
