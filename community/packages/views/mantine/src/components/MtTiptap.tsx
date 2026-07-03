import type {InputWrapperProps} from '@mantine/core'
import {Input} from '@mantine/core'
import {Link, RichTextEditor} from '@mantine/tiptap'
import {boolean, define, oneOfStrict, required, string} from '@react-form-builder/core'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import SubScript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import {useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {otherExtensionsCategory} from './internal/categories'
import {description, label, onChange, size} from './internal/sharedProps'

/**
 * Props for the MtTiptap component.
 */
export interface MtTiptapProps extends Omit<InputWrapperProps, 'children' | 'value' | 'onChange'> {
  /**
   * Initial content of the editor in HTML format.
   */
  value?: string

  /**
   * Callback fired when content of the editor changes.
   */
  onChange?: (value: string) => void

  /**
   * Input placeholder.
   */
  placeholder?: string

  /**
   * Controls whether typography styles are applied to the content.
   */
  withTypographyStyles?: boolean

  /**
   * Makes the toolbar sticky.
   */
  sticky?: boolean

  /**
   * Sticky toolbar offset.
   */
  stickyOffset?: string | number

  /**
   * Toolbar variant.
   */
  variant?: 'default' | 'subtle'
}

/**
 * Mantine rich text editor component for React Form Builder.
 * @param props component properties.
 * @returns rich text editor component.
 */
export function MtTiptap(props: MtTiptapProps) {
  const {
    value = '',
    onChange,
    label,
    description,
    error,
    id,
    required,
    withAsterisk,
    placeholder,
    withTypographyStyles,
    sticky,
    stickyOffset,
    variant,
  } = props

  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({link: false}),
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({types: ['heading', 'paragraph']}),
      Placeholder.configure({placeholder}),
    ],
    content: value,
    onUpdate: ({editor}) => {
      onChange?.(editor.getHTML())
    },
  })

  return (
    <Input.Wrapper
      label={label}
      description={description}
      error={error}
      id={id}
      required={required}
      withAsterisk={withAsterisk}
    >
      <RichTextEditor editor={editor} withTypographyStyles={withTypographyStyles} variant={variant}>
        <RichTextEditor.Toolbar sticky={sticky} stickyOffset={stickyOffset}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold/>
            <RichTextEditor.Italic/>
            <RichTextEditor.Underline/>
            <RichTextEditor.Strikethrough/>
            <RichTextEditor.ClearFormatting/>
            <RichTextEditor.Highlight/>
            <RichTextEditor.Code/>
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1/>
            <RichTextEditor.H2/>
            <RichTextEditor.H3/>
            <RichTextEditor.H4/>
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote/>
            <RichTextEditor.Hr/>
            <RichTextEditor.BulletList/>
            <RichTextEditor.OrderedList/>
            <RichTextEditor.Subscript/>
            <RichTextEditor.Superscript/>
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link/>
            <RichTextEditor.Unlink/>
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft/>
            <RichTextEditor.AlignCenter/>
            <RichTextEditor.AlignJustify/>
            <RichTextEditor.AlignRight/>
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo/>
            <RichTextEditor.Redo/>
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content/>
      </RichTextEditor>
    </Input.Wrapper>
  )
}

export const mtTiptap = define(MtTiptap, 'MtTiptap')
  .category(otherExtensionsCategory)
  // TODO FE-1803 add support for labels.
  .props({
    value: string.valued,
    onChange: onChange,
    label: label,
    placeholder: string.default('Start typing here...'),
    description: description,
    error: string,
    withAsterisk: required,
    size: size,
    withTypographyStyles: boolean.default(true),
    sticky: boolean.default(true),
    stickyOffset: string.default('var(--docs-header-height)'),
    variant: oneOfStrict('default', 'subtle').default('default'),
  })
