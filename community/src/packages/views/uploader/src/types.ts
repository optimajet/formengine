import type {ComponentProps} from 'react'
import type {DropzoneOptions} from 'react-dropzone'

/**
 * Represents a file with upload metadata.
 */
export interface FileType {
  /**
   * File name.
   */
  name?: string
  /**
   * File unique identifier.
   */
  fileKey?: number | string
  /**
   * Source file.
   */
  blobFile?: File
  /**
   * The URL of the file that can be previewed.
   */
  url?: string
  /**
   * Upload status.
   */
  status?: 'success' | 'error'
  /**
   * Error message if upload failed.
   */
  error?: string
}

/**
 * Callback function called when files are successfully uploaded.
 */
export type OnSuccess = (files: FileType[]) => void

/**
 * Callback function called when an error occurs during upload.
 */
export type OnError = (error: unknown, files?: FileType[]) => void

/**
 * The properties of the Uploader component.
 */
export interface UploaderProps extends DropzoneOptions, ComponentProps<any> {
  /**
   * Current value of the uploader (array of uploaded files).
   */
  value: FileType[]
  /**
   * URL to upload files to.
   */
  action: string
  /**
   * If true, the dropzone will show.
   */
  dropzone?: boolean
  /**
   * If true, the children are in disabled state.
   */
  disabled?: boolean

  /**
   * If true, the children are in read-only state.
   */
  readOnly?: boolean

  /**
   * Callback function called when files are successfully uploaded.
   */
  onChange?: OnSuccess

  /**
   * Callback function called when an error occurs during upload.
   */
  onError?: OnError
}
