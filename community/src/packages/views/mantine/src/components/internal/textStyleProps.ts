import {oneOfStrict, string} from '@react-form-builder/core'

/**
 * Shared text style props for typography components.
 */
export const textStyleProps = {
  c: string,
  fs: string,
  fw: string,
  ta: oneOfStrict('start', 'center', 'end', 'left', 'right', 'justify'),
  lh: string,
  td: string,
  tt: string,
  fz: string,
}

/**
 * Shared text style props for heading components.
 */
export const titleStyleProps = {
  c: string,
  fw: string,
  ta: oneOfStrict('start', 'center', 'end', 'left', 'right', 'justify'),
  lh: string,
  fz: string,
}
