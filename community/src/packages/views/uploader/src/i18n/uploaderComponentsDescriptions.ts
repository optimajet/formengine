import type {ComponentLibraryDescription, LanguageFullCode} from '@react-form-builder/core'
import arEgComponentsDescriptions from './ar-EG.json'
import deDeComponentsDescriptions from './de-DE.json'
import enUsComponentsDescriptions from './en-US.json'
import esEsComponentsDescriptions from './es-ES.json'
import faIrComponentsDescriptions from './fa-IR.json'
import frFrComponentsDescriptions from './fr-FR.json'
import hiInComponentsDescriptions from './hi-IN.json'
import itItComponentsDescriptions from './it-IT.json'
import jaJpComponentsDescriptions from './ja-JP.json'
import koKrComponentsDescriptions from './ko-KR.json'
import srRsComponentsDescriptions from './sr-RS.json'
import zhCnComponentsDescriptions from './zh-CN.json'

export const uploaderComponentsDescriptions: Record<LanguageFullCode, ComponentLibraryDescription> = {
  'ar-EG': arEgComponentsDescriptions,
  'de-DE': deDeComponentsDescriptions,
  'en-US': enUsComponentsDescriptions,
  'es-ES': esEsComponentsDescriptions,
  'fa-IR': faIrComponentsDescriptions,
  'fr-FR': frFrComponentsDescriptions,
  'hi-IN': hiInComponentsDescriptions,
  'it-IT': itItComponentsDescriptions,
  'ja-JP': jaJpComponentsDescriptions,
  'ko-KR': koKrComponentsDescriptions,
  'sr-RS': srRsComponentsDescriptions,
  'zh-CN': zhCnComponentsDescriptions,
}
