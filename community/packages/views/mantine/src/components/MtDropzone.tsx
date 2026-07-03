import type {InputWrapperProps} from '@mantine/core'
import {Center, CloseButton, Group, Input, List} from '@mantine/core'
import type {DropzoneProps} from '@mantine/dropzone'
import {Dropzone} from '@mantine/dropzone'
import {array, boolean, define, node, number, required, string} from '@react-form-builder/core'
import {useCallback} from 'react'
import type {FileWithPath} from 'react-dropzone'
import {otherExtensionsCategory} from './internal/categories'
import {description, label, onChange, size} from './internal/sharedProps'

/**
 * Props for the MtDropzone component.
 */
export interface MtDropzoneProps
  extends Omit<DropzoneProps, 'children' | 'onChange' | 'onDrop'>,
    Omit<InputWrapperProps, 'children' | keyof DropzoneProps> {
  /**
   * Optional custom dropzone content.
   */
  children?: React.ReactNode
  /**
   * List of picked files.
   */
  value?: File[]

  /**
   * Called when files are picked or removed.
   */
  onChange?: (files: File[]) => void
}

/**
 * Mantine dropzone component for React Form Builder.
 * @param props component properties.
 * @returns dropzone component.
 */
export function MtDropzone(props: MtDropzoneProps) {
  const {
    label,
    description,
    error,
    id,
    required,
    withAsterisk,
    value,
    onChange,
    children,
    ...others
  } = props

  const handleDrop = useCallback((files: FileWithPath[]) => {
    onChange?.(files)
  }, [onChange])

  const handleCloseClick = useCallback((index: number) => {
    return () => {
      onChange?.(value?.filter((_, i) => i !== index) || [])
    }
  }, [onChange, value])

  const pickedFiles = (value || []).map((file, index) => (
    <List.Item key={`${file.name}-${index}`}>
      <Group>
        <span>{file.name}</span>

        <CloseButton onClick={handleCloseClick(index)}/>
      </Group>
    </List.Item>
  ))

  return (
    <Input.Wrapper
      label={label}
      description={description}
      error={error}
      id={id}
      required={required}
      withAsterisk={withAsterisk}
    >
      <Dropzone onDrop={handleDrop} {...others}>
        {children || (
          <Center h={120}>
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>Drop zone reject</Dropzone.Reject>
            <Dropzone.Idle>Drop files here to upload</Dropzone.Idle>
          </Center>
        )}
      </Dropzone>

      {pickedFiles.length > 0 && <List mt="sm">{pickedFiles}</List>}
    </Input.Wrapper>
  )
}

export const mtDropzone = define(MtDropzone, 'MtDropzone')
  .category(otherExtensionsCategory)
  .props({
    size: size,
    label: label,
    description: description,
    error: string,
    children: node,
    accept: string,
    multiple: boolean.default(true),
    disabled: boolean.default(false),
    loading: boolean.default(false),
    maxFiles: number,
    maxSize: number,
    value: array.valued,
    onChange: onChange,
    withAsterisk: required,
  })
