import {cx} from '@emotion/css'
import {array, boolean, define, disabled, event, object, readOnly, string, stringNode} from '@react-form-builder/core'
import {useCallback, useMemo} from 'react'
import type {DropzoneOptions, DropzoneState} from 'react-dropzone'
import {useDropzone} from 'react-dropzone'
import {containerStyle} from './style'
import type {FileType, UploaderProps} from './types'
import {uploadFiles} from './utils/upload'

const defaultContent = `Drop some files here, or click to select files`

const getClassName = (state: Partial<DropzoneState>, dropzone?: boolean, className?: string) => {
  const {isDragAccept, isDragReject, isDragActive} = state
  return cx({isDragAccept, isDragReject, isDragActive, dropzone}, containerStyle, className)
}

const Uploader = ({children, dropzone, value, className, action, onChange, onError, onDrop, onDropRejected, ...props}: UploaderProps) => {
  const handleFileUpload = useCallback((acceptedFiles: File[]) => {
    if (!action) return

    const handleChange = (files?: FileType[]) => {
      if (files?.length) {
        onChange?.([
          ...(value ?? []),
          ...files
        ])
      }
    }

    const handleError = (error: unknown, files?: FileType[]) => {
      handleChange(files)
      onError?.(error)
    }

    uploadFiles(acceptedFiles, action, handleChange, handleError).catch()
  }, [action, onChange, onError, value])

  const dropzoneOptions = useMemo<DropzoneOptions>(() => ({
      ...props,
      noDrag: !dropzone,
      onDrop: handleFileUpload,
    }
  ), [dropzone, handleFileUpload, props])
  const {getInputProps, getRootProps, ...state} = useDropzone(dropzoneOptions)

  const dropzoneProps = useMemo(() => getRootProps({
    className: getClassName(state, dropzone, className)
  }), [className, dropzone, state, getRootProps])

  const inputProps = useMemo(() => getInputProps(), [getInputProps])

  return (
    <div {...dropzoneProps}>
      <input {...inputProps}/>
      {children}
    </div>
  )
}

export const uploader = define(Uploader, 'Uploader')
  .category('fields')
  .props({
    action: string.required.default('/'),
    value: array.valued.hideEditor(),
    children: stringNode.setup({default: defaultContent}),
    accept: object,
    dropzone: boolean.default(true),
    multiple: boolean,
    disabled: disabled,
    readOnly: readOnly,
    onChange: event,
    onError: event
  })
