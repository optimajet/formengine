import type {IFormBuilder} from '@react-form-builder/designer'
import {useCallback} from 'react'
import {Button, ButtonGroup} from 'rsuite'
import {getBuilderInstance} from '../utils/getBuilderInstance'
import {useBuilderRef} from './BuilderRefContext'

const copyForm = (formBuilder: IFormBuilder | null) => {
  if (!formBuilder) return

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(formBuilder.formAsString).catch(console.error)
  }
}

const pasteForm = (formBuilder: IFormBuilder | null) => {
  if (!formBuilder) return
  if (!navigator.clipboard || !navigator.clipboard.readText) return

  navigator.clipboard
    .readText()
    .then(text => {
      formBuilder.parseForm(text)
    })
    .catch(console.error)
}

/**
 * Component that provides copy and paste buttons for the form builder.
 * @returns the buttons or null.
 */
export const CopyPasteButtons = () => {
  const builderRef = useBuilderRef()
  const handleCopy = useCallback(() => copyForm(getBuilderInstance(builderRef)), [builderRef])
  const handlePaste = useCallback(() => pasteForm(getBuilderInstance(builderRef)), [builderRef])

  if (!builderRef) return null

  return (
    <ButtonGroup size={'sm'}>
      <Button appearance={'ghost'} onClick={handleCopy}>
        Copy form&#39;s JSON
      </Button>
      <Button appearance={'ghost'} onClick={handlePaste}>
        Paste
      </Button>
    </ButtonGroup>
  )
}
