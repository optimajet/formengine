import type {FormBuilderProps} from '@react-form-builder/designer'
import type {PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useMemo, useState} from 'react'

type BuilderRef = FormBuilderProps['builderRef']

type BuilderRefContext = {
  builderRef?: BuilderRef
  setBuilderRef: (ref: BuilderRef) => void
}

const BuilderRefContext = createContext<BuilderRefContext | undefined>(undefined)

/**
 * Hook to access the builder ref from context.
 * @returns the builder ref or undefined if not available.
 */
export const useBuilderRef = (): BuilderRef | undefined => {
  const context = useContext(BuilderRefContext)
  return context?.builderRef
}

/**
 * Hook to set the builder ref in context.
 * @returns a function to set the builder ref or undefined.
 */
export const useSetBuilderRef = () => {
  const context = useContext(BuilderRefContext)
  return context?.setBuilderRef
}

/**
 * Provider component for the builder ref context.
 * @param props the React component properties.
 * @returns the React element.
 */
export const BuilderRefProvider = (props: PropsWithChildren<any>) => {
  const [builderRef, setBuilderRefState] = useState<BuilderRef | undefined>(undefined)

  const setBuilderRef = useCallback((ref: BuilderRef) => {
    setBuilderRefState(ref)
  }, [])

  const value = useMemo(() => ({builderRef, setBuilderRef}), [builderRef, setBuilderRef])

  return <BuilderRefContext.Provider value={value}>{props.children}</BuilderRefContext.Provider>
}
