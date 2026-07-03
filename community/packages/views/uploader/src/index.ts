import uploaderEnUsComponentsDescriptions from './i18n/en-US.json'
import {uploader} from './Uploader'

export const uploaderComponent = uploader
export const uploaderModel = uploader.build().model

export {uploaderEnUsComponentsDescriptions}
export {uploaderComponentsDescriptions} from './i18n/uploaderComponentsDescriptions'
export type {FileType, OnError, OnSuccess, UploaderProps} from './types'
