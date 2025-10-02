import {array, boolean, define, disabled, event, node, oneOf, string} from '@react-form-builder/core'
import {useEffect, useMemo, useRef} from 'react'
import type {UploaderProps} from 'rsuite'
import {Uploader} from 'rsuite'
import {nonNegNumber, readOnly} from '../commonProperties'
import {setAriaHiddenIfNotExists} from '../hooks'
import {fieldsCategory} from './categories'
import {InputCell} from './components/InputCell'
import {Labeled} from './components/Labeled'
import {useTouchOnEvent} from './hooks/useTouchOnEvent'

/**
 * Props for the RsUploader component.
 */
export interface RsUploaderProps extends UploaderProps {
  /**
   * Whether to use a custom element for the uploader.
   */
  customElement: boolean
  /**
   * The label for the uploader.
   */
  label?: string
}

/**
 * A file uploader component that allows users to select and upload files.
 * @param props the component props.
 * @param props.customElement whether to use a custom element for the uploader.
 * @param props.children the custom content when customElement is true.
 * @param props.disabled whether the uploader is disabled.
 * @param props.multiple whether multiple files can be selected.
 * @param props.fileList the list of uploaded files.
 * @param props.className the CSS class name for the component.
 * @param props.label the label for the uploader.
 * @returns the React element.
 */
const RsUploader = ({customElement, children, disabled, multiple, fileList, className, label, ...props}: RsUploaderProps) => {
  const uploaderRef = useRef<any>(null)
  const onRemove = useTouchOnEvent(props, 'onRemove')

  useEffect(() => {
    const fileInput = uploaderRef.current?.root?.querySelector('input[type="file"]')
    setAriaHiddenIfNotExists(fileInput)
    if (fileInput && !fileInput.hasAttribute('tabIndex')) {
      fileInput.setAttribute('tabIndex', '-1')
    }
  }, [])

  const canUpload = useMemo(() => {
    if (multiple) return true
    return !(fileList && fileList.length > 0)
  }, [fileList, multiple])

  const disabledButton = useMemo(() => disabled || !canUpload, [disabled, canUpload])

  return <Labeled label={label} className={className} passAriaToChildren={true}>
    <Uploader {...props} disabled={disabledButton} multiple={multiple}
              fileList={fileList} onRemove={onRemove} ref={uploaderRef}>
      {customElement ? <div>{children}</div> : undefined}
    </Uploader>
  </Labeled>
}

const columns = [
  {name: 'name', input: InputCell},
  {name: 'fileKey', input: InputCell},
  {name: 'url', input: InputCell}
]

export const rsUploader = define(RsUploader, 'RsUploader')
  .name('Uploader')
  .category(fieldsCategory)
  .props({
    label: string,
    action: string.required.default('/'),
    accept: string,
    autoUpload: boolean.default(true),
    customElement: boolean.default(false),
    children: node,
    disableMultipart: boolean.default(false),
    disabled: disabled.default(false),
    readOnly,
    disabledFileItem: boolean.default(false),
    draggable: boolean.default(false),
    fileListVisible: boolean.default(true),
    listType: oneOf('text', 'picture-text', 'picture')
      .withEditorProps({creatable: false}),
    method: string,
    multiple: boolean.default(false),
    name: string,
    onChange: event,
    onError: event,
    onPreview: event,
    onProgress: event,
    onRemove: event,
    onReupload: event,
    onSuccess: event,
    onUpload: event,
    removable: boolean.default(false),
    timeout: nonNegNumber,
    withCredentials: boolean.default(false),
    fileList: array
      .withEditorProps({columns})
      .valued
  })
