import type {Language, LanguageFullCode} from './types'

function findLanguageByCode(availableLanguages: Language[], code: string) {
  return availableLanguages.find(l => l.code === code)
}

/**
 * Finds {@link Language} by language code.
 * @param languages the array of languages to look in.
 * @param language the language code.
 * @returns found {@link Language}, or the default Language if no Language exists for the language code.
 */
export function findLanguage(languages: Array<Language>, language: LanguageFullCode): Language | undefined {
  const [code, dialect] = language.split('-')

  if (dialect) {
    const langByFullCode = languages.find(l => l.code === code && l.dialect === dialect)
    if (langByFullCode) return langByFullCode

    const languageByCode = findLanguageByCode(languages, code)
    if (languageByCode) return languageByCode
  }

  return findLanguageByCode(languages, language)
}
