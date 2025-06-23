import {BiDi} from './bidi'

/**
 * The full language code, e.g. 'en-US'.
 */
export type LanguageFullCode = `${string}-${string}`

/**
 * The language to localize the form builder.
 */
export class Language {

  /**
   * Creates a localization language for the form builder.
   * @param code the language code, for example, 'en'.
   * @param dialect the dialect code, for example, 'US'.
   * @param name the name of the language, for example 'English'.
   * @param description the description of the language, for example 'American English'.
   * @param bidi the type of text layout, for example, BiDi.LTR.
   */
  constructor(
    readonly code: string,
    readonly dialect: string,
    readonly name: string,
    readonly description: string,
    readonly bidi: BiDi = BiDi.LTR,
  ) {
  }

  /**
   * @returns Full code of the Language i.e en-US, en-GB etc.
   */
  get fullCode(): LanguageFullCode {
    return `${this.code}-${this.dialect}`
  }

  /**
   * Clones an existing instance of the language.
   * @param source the cloning object.
   * @returns the object clone.
   */
  static clone(source: Language) {
    return new Language(source.code, source.dialect, source.name, source.description, source.bidi)
  }
}
