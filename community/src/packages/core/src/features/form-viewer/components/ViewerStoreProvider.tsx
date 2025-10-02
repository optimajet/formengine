import type {ReactNode} from 'react'
import {useCallback, useContext, useEffect, useImperativeHandle} from 'react'
import {ComponentState} from '../../../stores/ComponentState'
import type {ComponentStore} from '../../../stores/ComponentStore'
import {FormViewerPropsStore} from '../../../stores/FormViewerPropsStore'
import type {ComponentStateFactory} from '../../../stores/Store'
import {Store} from '../../../stores/Store'
import {namedObserver} from '../../../utils'
import type {ComponentData} from '../../../utils/contexts/ComponentDataContext'
import {StoreContext, StoreProvider} from '../../../utils/contexts/StoreContext'
import {getChildren} from '../../../utils/getChildren'
import {useDisposable} from '../../../utils/useDisposable'
import type {ComponentPropertiesContext} from '../../properties-context/ComponentPropertiesContext'
import {ComponentTree} from '../../ui/ComponentTree'
import type {FormViewerProps} from '../types'
import {ViewerPropsProvider} from './ViewerPropsContext'

/**
 * Properties of the React component ViewerStoreProvider.
 */
export interface ViewerStoreProviderProps {

  /**
   * Children component.
   */
  children: ReactNode

  /**
   * Form viewer React component properties.
   */
  props: FormViewerProps
}

interface ExistingStoreProviderProps extends ViewerStoreProviderProps {
  store: Store
}

const RawNotifier = (props: Omit<ExistingStoreProviderProps, 'children'>) => {
  const {store} = props
  const viewerProps = props.props

  useEffect(() => {
    viewerProps.onFormDataChange?.(store.formData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.formData.data, store.formData.errors])

  useEffect(() => {
    store.formViewerPropsStore.applyProps(viewerProps)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerProps.initialData, viewerProps.view, viewerProps.validators, viewerProps.formValidators,
    viewerProps.localize, viewerProps.language, viewerProps.actions, viewerProps.errorWrapper,
    viewerProps.readOnly, viewerProps.disabled, viewerProps.componentWrapper])

  return null
}

const Notifier = namedObserver('Notifier', RawNotifier)

const RawExistingStoreProvider = ({
                                    children,
                                    props: {viewerRef, ...props},
                                    store
                                  }: ExistingStoreProviderProps) => {
  useImperativeHandle(viewerRef, () => store, [store])

  return (
    <ViewerPropsProvider value={props}>
      <Notifier store={store} props={props}/>
      <StoreProvider value={store}>
        {children}
      </StoreProvider>
    </ViewerPropsProvider>
  )
}

const ExistingStoreProvider = namedObserver('ExistingStoreProvider', RawExistingStoreProvider)

/**
 * The default component state factory.
 * @param data the data needed to display the component.
 * @param store the form viewer settings.
 * @param context the context for working with component properties.
 * @returns the component property calculator.
 */
export const defaultComponentStateFactory: ComponentStateFactory = (data: ComponentData, store: Store,
                                                                    context?: ComponentPropertiesContext) => {
  function defaultComponentLocalizer(componentStore: ComponentStore) {
    return store.localizeComponent('component', data.dataRoot, componentStore)
  }

  function defaultComputeChildren(componentData: ComponentData, componentProps: Record<string, any>) {
    return getChildren(componentData, ComponentTree, componentProps)
  }

  return new ComponentState(data, store, defaultComponentLocalizer, defaultComputeChildren, context)
}

const RawNewStoreProvider = ({children, props}: ViewerStoreProviderProps) => {
  const storeFactory = useCallback(() => new Store(new FormViewerPropsStore(props), defaultComponentStateFactory), [props])
  const store = useDisposable(storeFactory)

  if (!store) return null

  return <ExistingStoreProvider props={props} store={store}>
    {children}
  </ExistingStoreProvider>
}

export const NewStoreProvider = namedObserver('NewStoreProvider', RawNewStoreProvider)

/**
 * React component encapsulating MobX storage for the form viewer.
 * @param props the React component properties.
 * @returns the React element.
 */
const RawViewerStoreProvider = (props: ViewerStoreProviderProps) => {
  const storeFromContext = useContext(StoreContext)

  return storeFromContext
    ? <ExistingStoreProvider props={props.props} store={storeFromContext}>{props.children}</ExistingStoreProvider>
    : <NewStoreProvider props={props.props}>{props.children}</NewStoreProvider>
}

export const ViewerStoreProvider = namedObserver('ViewerStoreProvider', RawViewerStoreProvider)
