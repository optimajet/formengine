// eslint-disable-next-line import/extensions
import {arEG, deDE, enUS, esES, faIR, frFR, hiIN, itIT, jaJP, koKR, srRS, zhCN} from '@mui/material/locale'
import type {Language} from '@react-form-builder/core'
import {globalDefaultLanguage} from '@react-form-builder/core'

const locales = {
  arEG,
  deDE,
  enUS,
  esES,
  faIR,
  frFR,
  hiIN,
  itIT,
  jaJP,
  koKR,
  srRS,
  zhCN
}

type MuiLocale = keyof (typeof locales)
const getFullCode = ({code, dialect} = globalDefaultLanguage) => `${code}-${dialect}`

/**
 * Returns the mui locale.
 * @param language the FormBuilder {@link Language}.
 * @returns the mui locale.
 */
export const getLocale = (language?: Language) => locales[getFullCode(language) as MuiLocale]
