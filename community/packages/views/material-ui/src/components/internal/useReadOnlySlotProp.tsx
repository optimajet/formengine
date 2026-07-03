import {useMemo} from 'react'

const readOnlySlotProps = {
  input: {
    readOnly: true
  }
}

/**
 * Hook that provides readOnly slot props to a component.
 * @param readOnly if true, the form control will be read-only.
 * @returns the component props with slotProps.
 */
export const useReadOnlySlotProp = (readOnly?: boolean) => {
  return useMemo(() => readOnly ? readOnlySlotProps : undefined, [readOnly])
}
