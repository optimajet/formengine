import {event} from '@react-form-builder/core'

/**
 * Shared props for inputs with left/right sections.
 */
export const inputSectionProps = {
  // TODO FE-1803 FE-1804
  // leftSection: node,
  // rightSection: node,
  // leftSectionWidth: number,
  // rightSectionWidth: number,
  // leftSectionPointerEvents: oneOfStrict('auto', 'none'),
  // rightSectionPointerEvents: oneOfStrict('auto', 'none'),
}

/**
 * Shared focus/blur event props for inputs.
 */
export const inputFocusProps = {
  onFocus: event,
  onBlur: event,
}
