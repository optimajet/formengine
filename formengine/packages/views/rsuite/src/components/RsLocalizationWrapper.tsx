import type {FormViewerWrapperComponentProps} from '@react-form-builder/core'
import {CustomProvider} from 'rsuite'
import {
  arEG,
  daDK,
  deDE,
  enGB,
  enUS,
  esAR,
  esES,
  fiFI,
  frFR,
  huHU,
  itIT,
  jaJP,
  kkKZ,
  koKR,
  nlNL,
  ptBR,
  svSE,
  trTR,
  zhCN,
  zhTW
} from 'rsuite/esm/locales/index.js'
import {hiIN} from './i18n/hi-IN'
import {srRS} from './i18n/sr-RS'

const rSuiteLocales: Record<string, any> = {
  'ar-EG': arEG,
  'de-DE': deDE,
  'en-US': enUS,
  'it-IT': itIT,
  'fr-FR': frFR,
  'es-ES': esES,
  'zh-CN': zhCN,
  'da-DK': daDK,
  'en-GB': enGB,
  'es-AR': esAR,
  'fi-FI': fiFI,
  'hi-IN': hiIN,
  'hu-HU': huHU,
  'kk-KZ': kkKZ,
  'ko-KR': koKR,
  'nl-NL': nlNL,
  'pt-BR': ptBR,
  'sr-RS': srRS,
  'sv-SE': svSE,
  'tr-TR': trTR,
  'zh-TW': zhTW,
  'ja-JP': jaJP,
}

export const defaultComponentsLocale = enUS

/**
 * Wrapper component for RSuite components localization.
 * @param props the component props.
 * @param props.language the language object containing the language information.
 * @param props.children the children components to be wrapped.
 * @returns the wrapped components with localization settings applied.
 */
export const RsLocalizationWrapper = ({language, children}: FormViewerWrapperComponentProps) => {
  return <CustomProvider rtl={language.bidi === 'rtl'} locale={rSuiteLocales[language.fullCode] ?? defaultComponentsLocale}>
    {children}
  </CustomProvider>
}
