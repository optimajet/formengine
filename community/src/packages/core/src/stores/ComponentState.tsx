import {css, cx} from '@emotion/css'
import {makeAutoObservable} from 'mobx'
import {calculateProperties} from '../features/calculation/propertyCalculator'
import {silentTransformCssString} from '../features/css-style/cssTransform'
import type {Model} from '../features/define'
import {cfEventHandlers} from '../features/define/utils/integratedComponentFeatures'
import type {ActionData, ActionEventHandler, EventName} from '../features/event'
import {ActionEventArgs, DidMountEvent, WillUnmountEvent} from '../features/event'
import {getArgumentFunction, isFunctionArgumentValue} from '../features/event/consts/functionArgument'
import type {ComponentPropertiesContext} from '../features/properties-context/ComponentPropertiesContext'
import {getDefaultPropertiesContext} from '../features/properties-context/getDefaultPropertiesContext'
import type {CssPart} from '../features/style/types'
import {isPromise} from '../utils'
import type {ComputeChildren} from '../utils/ComputeChildren'
import type {ComponentData} from '../utils/contexts/ComponentDataContext'
import {nameObservable} from '../utils/observableNaming'
import type {ComponentStore, ComponentStyle} from './ComponentStore'
import type {ComponentStoreLocalizer} from './ComponentStoreLocalizer'
import type {IComponentState} from './IComponentState'
import type {Store} from './Store'

const getCustomEventHandlers = (model: Model) => {
  const customHandlers = model.features[cfEventHandlers]
  if (customHandlers) return customHandlers as Record<EventName, ActionEventHandler>
}

const getHtmlAttributes = (componentStore: ComponentStore) => componentStore.htmlAttributes
  ?.reduce((result: Record<string, string>, {name, value}) => {
    try {
      result[name] = JSON.parse(value)
    } catch {
      result[name] = value
    }
    return result
  }, {})

const isRequired = (componentStore: ComponentStore) => {
  return !!componentStore.schema?.validations?.find(v => v.key === 'required')
}

const bindFunctionsInArgs = (e: ActionEventArgs, args: Record<string, any>) => {
  const functionEntries: [string, Function][] = []

  for (const [key, value] of Object.entries(args)) {
    if (isFunctionArgumentValue(value)) {
      const fn = getArgumentFunction(value.body || '')
      functionEntries.push([key, fn])
    }
  }

  const boundArgs = {...args}
  for (const [key, fn] of functionEntries) {
    boundArgs[key] = (evtOrParam: any, argsOrParam: any, ...userArgs: any) => {
      if (!(evtOrParam instanceof ActionEventArgs) && argsOrParam !== boundArgs) {
        return fn(e, boundArgs, ...userArgs)
      }

      return fn(evtOrParam, argsOrParam, ...userArgs)
    }
  }

  return boundArgs
}

function createActionHandlersChain(store: Store, actionDataList: ActionData[]) {
  const actions = actionDataList.map(data => ({
    func: store.findAction(data).func,
    args: {...data.args}
  }))

  return async (e: ActionEventArgs) => {
    try {
      for (const {func, args} of actions) {
        const withBoundFnArgs = bindFunctionsInArgs(e, args)
        const result = func(e, withBoundFnArgs)

        if (isPromise(result)) await result
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.info('Action handler throws an error', e)
    }
  }
}

const createDefaultActionHandler = (componentState: ComponentState, eventName: EventName) => {
  return async (...args: any[]) => {
    const {data, store} = componentState
    const actionDataList = data.store.events?.[eventName] ?? []
    const handlersChain = createActionHandlersChain(store, actionDataList)
    const renderedProps = componentState.get
    const actionEventArgs = new ActionEventArgs(eventName, data, store, args, renderedProps, componentState.context.cellInfo)
    await handlersChain(actionEventArgs)
  }
}

const computeEvents = (componentState: ComponentState) => {
  const events = {} as Record<EventName, Function>
  const {data} = componentState

  const eventHandlers = getCustomEventHandlers(data.model) ?? componentState.context.eventHandlers ?? {}

  const eventKeyArray = [
    ...Object.keys(data.store.events ?? {}),
    ...Object.keys(eventHandlers)
  ]

  const set = new Set(eventKeyArray)
  set.delete(DidMountEvent)
  set.delete(WillUnmountEvent)

  set.forEach((name) => {
    events[name] = async (...args: any[]) => {
      const handler = eventHandlers[name]
      if (handler) {
        const actionEventArgs = new ActionEventArgs(name, data, componentState.store, args, componentState.get,
          componentState.context.cellInfo)
        const handlerResult = handler(actionEventArgs)
        if (isPromise(handlerResult)) await handlerResult
      }

      const defaultHandler = createDefaultActionHandler(componentState, name)
      await defaultHandler(...args)
    }
  })

  return events
}

/**
 * Calculates all the properties of the form view component.
 */
export class ComponentState implements IComponentState {

  /**
   * The context for working with component properties.
   */
  readonly context: ComponentPropertiesContext

  /**
   * Creates an instance that calculates the properties of the form viewer component.
   * @param data the data needed to display the component.
   * @param store the form viewer settings.
   * @param localizer the function to localize the properties of a component, returns a Record with localized properties.
   * @param computeChildren the function that calculates all child properties of a component.
   * @param context the context for working with component properties.
   */
  constructor(
    readonly data: ComponentData,
    readonly store: Store,
    readonly localizer: ComponentStoreLocalizer,
    readonly computeChildren: ComputeChildren,
    context?: ComponentPropertiesContext,
  ) {
    this.context = context ?? getDefaultPropertiesContext(data)
    makeAutoObservable(this, undefined, {name: nameObservable('ComponentState', {key: data.key})})
  }

  /**
   * @inheritDoc
   */
  get get(): Record<string, any> {
    const propsWithoutChildren = this.propsWithoutChildren
    return Object.assign({}, propsWithoutChildren, this.className, this.children(propsWithoutChildren))
  }

  /**
   * @inheritDoc
   */
  get ownProps() {
    return {...this.propsWithoutChildren, ...this.className}
  }

  /**
   * @inheritDoc
   */
  get propsWithoutChildren(): Record<string, any> {
    const {htmlAttributes, ...calculated} = this.calculatedProps

    return Object.assign(
      {key: this.data.store.key},
      this.data.model.defaultProps,
      calculated,
      this.localizedProps,
      this.value,
      this.readOnly,
      this.disabled,
      this.events,
      htmlAttributes ?? this.htmlAttributes,
      this.style,
      this.data.userDefinedProps,
    )
  }

  /**
   * @returns the component's field value data, if the component can have a field value.
   */
  get value() {
    const valueProperty = this.context.valueProperty
    if (valueProperty) {
      return {[valueProperty.propertyName]: valueProperty.propertyValue}
    }
  }

  /**
   * @returns the read-only property of a component if the component has a read-only flag.
   */
  get readOnly() {
    if (this.data.model.readOnly) {
      return {[this.data.model.readOnly]: this.isReadOnly}
    }
  }

  /**
   * @inheritDoc
   */
  get isReadOnly() {
    if (!this.data.model.readOnly) return false

    return this.store.formViewerPropsStore.readOnly
      || this.data.parent?.componentState.isReadOnly
      || (this.selfProps[this.data.model.readOnly] ?? false)
  }

  /**
   * @returns the disabled property of a component if the component has a disabled flag.
   */
  get disabled() {
    if (this.data.model.disabled) {
      return {[this.data.model.disabled]: this.isDisabled}
    }
  }

  /**
   * @inheritDoc
   */
  get isDisabled() {
    if (!this.data.model.disabled) return false

    return this.store.formViewerPropsStore.disabled
      || this.data.parent?.componentState.isDisabled
      || (this.selfProps[this.data.model.disabled] ?? false)
  }

  /**
   * @returns the values for all properties of the component, calculates the values of the calculated properties.
   */
  get calculatedProps() {
    return calculateProperties(this.data.store, this.data.dataRoot)
  }

  /**
   * @returns component localized properties.
   */
  get localizedProps() {
    return this.localizer(this.data.store)
  }

  /**
   * @returns the component event handlers that send events to the event bus.
   */
  get events() {
    return computeEvents(this)
  }

  /**
   * Calculates and returns className property.
   * @returns the Record that contains the className property for the component.
   */
  get className() {
    const className = cx(
      {required: isRequired(this.data.store)},
      this.propsWithoutChildren.className,
      this.getClassNameFromCssPart('css')
    )
    return {className}
  }

  /**
   * @inheritDoc
   */
  get wrapperClassName() {
    return this.getClassNameFromCssPart('wrapperCss')
  }

  /**
   * @returns the Record that contains the style property for the component.
   */
  get style() {
    return this.getStyleFromStylePart(this.data.store.style)
  }

  /**
   * @inheritDoc
   */
  get wrapperStyle() {
    return this.getStyleFromStylePart(this.data.store.wrapperStyle)
  }

  /**
   * @returns all arbitrary HTML attributes of the component.
   */
  get htmlAttributes() {
    return getHtmlAttributes(this.data.store)
  }

  /**
   * Calculates and returns all child components.
   * @param props the React component properties.
   * @returns the Record that contains the child components of a component.
   */
  children(props: any) {
    return this.computeChildren(this.data, props)
  }

  /**
   * @inheritDoc
   */
  onDidMount() {
    this.executeLifecycleEvent(DidMountEvent)
  }

  /**
   * @inheritDoc
   */
  onWillUnmount() {
    this.executeLifecycleEvent(WillUnmountEvent)
  }

  private executeLifecycleEvent(eventName: EventName) {
    const handler = createDefaultActionHandler(this, eventName)
    const mountEvent = new ActionEventArgs(eventName, this.data, this.store, [], this.get, this.context.cellInfo)
    handler(mountEvent).catch(console.error)
  }

  private getStyleFromStylePart(stylePart?: ComponentStyle) {
    const {viewMode} = this.store

    const anyCss = silentTransformCssString(stylePart?.any?.string)
    const viewModeCss = silentTransformCssString(stylePart?.[viewMode]?.string)

    if (anyCss || viewModeCss) return {style: {...anyCss, ...viewModeCss}}
  }

  private getClassNameFromCssPart(cssPart: CssPart) {
    const {model, store} = this.data
    const {viewMode} = this.store

    const cssObjectAny = Object.assign({},
      model[cssPart]?.any?.object,
      store[cssPart]?.any?.object
    )
    const cssObjectCurrent = Object.assign({},
      model[cssPart]?.[viewMode]?.object,
      store[cssPart]?.[viewMode]?.object
    )

    return css`
      && {
        ${cssObjectAny}
        ${cssObjectCurrent}
        ${store[cssPart]?.any?.string}
        ${store[cssPart]?.[viewMode]?.string}
      }
    `
  }

  private get selfProps() {
    const {htmlAttributes, ...calculated} = this.calculatedProps
    return {
      ...this.data.model.defaultProps,
      ...calculated,
      ...this.localizedProps,
      ...this.value,
      ...this.style,
      ...this.data.userDefinedProps,
    } as Record<string, any>
  }
}
