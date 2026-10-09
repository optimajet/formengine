import type {Definer, Model} from '@react-form-builder/core'
import uploaderEnUsComponentsDescriptions from './i18n/en-US.json'
import type {UploaderProps} from './types'
import {uploader} from './Uploader'

export const uploaderComponent: Definer<UploaderProps> = uploader
export const uploaderModel: Model = uploader.build().model

export {uploaderComponentsDescriptions} from './i18n/uploaderComponentsDescriptions'
export type {FileType, OnError, OnSuccess, UploaderProps} from './types'
export {uploaderEnUsComponentsDescriptions}
