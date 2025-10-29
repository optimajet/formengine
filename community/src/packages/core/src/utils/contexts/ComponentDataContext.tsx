import type {IReactionDisposer} from 'mobx'
import {makeAutoObservable, reaction} from 'mobx'
import {isRecord} from '..'
import type {Model} from '../../features/define'
import {cfSkipChildrenDuringFieldCollection} from '../../features/define/utils/integratedComponentFeatures'
import {getFluentData} from '../../features/localization/getFluentData'
import type {Field} from '../../features/validation'
import type {ValidationMessages} from '../../features/validation/types/ValidationResult'
import type {ComponentField} from '../../features/validation/utils/Field'
import type {IDataReaction} from '../../features/validation/utils/IDataReaction'
import type {SetInitialDataFn} from '../../features/validation/utils/SetInitialDataFn'
import type {ComponentStore} from '../../stores/ComponentStore'
import {dataKey} from '../../stores/ComponentStore'
import {defaultComponentState} from '../../stores/IComponentState'
import {createNonNullableContext} from '../createNonNullableContext'
import {mergeData} from '../data-utils'
import type {IFormData} from '../IFormData'
import {nameObservable} from '../observableNaming'
import {SyncEvent} from '../SyncEvent'
import {camelCase, isEmpty, isUndefined, merge, uniqueId} from '../tools'
import {treeForEach} from '../treeUtils'

function assignNewKey(item: ComponentStore, existingKeys: Set<string>) {
  let count = 1
  const baseKey = camelCase(item.type)
  const generateKey = () => `${baseKey}${count}`
  while (existingKeys.has(generateKey())) count++
  item.key = generateKey()
  return item.key
}

function isDataReactionField(value: any): value is IDataReaction {
  return typeof value['disableReaction'] === 'function'
}

/**
 * Represents the event argument for the event when the component key changes.
 */
export class ComponentKeyChangedEventArgs {
  /**
   * Constructs a new instance of the ComponentKeyChangedEventArgs class.
   * @param oldKey the old key.
   * @param newKey the new key.
   */
  constructor(readonly oldKey: string, readonly newKey: string) {
  }
}

/**
 * Represents a class that holds events related to component data.
 */
export class ComponentDataEvents {
  /**
   * An event that occurs after a component key change.
   */
  readonly onAfterKeyChanged: SyncEvent<ComponentData, ComponentKeyChangedEventArgs> = new SyncEvent()
  /**
   * An event that occurs before a component is removed from the component tree.
   */
  readonly onBeforeDelete: SyncEvent<ComponentData, undefined> = new SyncEvent()

  /**
   * Unsubscribe from all events.
   */
  dispose() {
    this.onAfterKeyChanged.dispose()
    this.onBeforeDelete.dispose()
  }
}

/**
 * A provider for a set of components.
 */
export interface IComponentDataProvider {
  /**
   * @returns the component set.
   */
  get componentData(): ComponentData[]
}

/**
 * Provides the root component for the data in the component tree.
 */
export interface IDataRootProvider {
  /**
   * @returns the root component for the data in the component tree.
   */
  get dataRoot(): ComponentData
}

/**
 * Replaces empty form fields with an empty string. **Internal use only.**
 * @param form the form.
 * @returns all form data where empty fields are filled with empty strings.
 */
export const getEditableFormData = (form: ComponentData) => {
  const result: Record<string, unknown> = {}

  Object.entries(form.data).forEach(([key, value]) => {
    result[key] = value ?? ''
  })

  return result
}

/**
 * This tree of elements contains the data required to display the component. It is synchronized with the ComponentStore tree.
 */
export class ComponentData implements IFormData {
  #disposers: IReactionDisposer[]
  #events?: ComponentDataEvents
  #getFormValidatorsResult?: () => Promise<Record<string, string>[]>
  private _state: Record<string, unknown> = {}
  /**
   * The unique identifier.
   */
  readonly id: string
  /**
   * The component settings.
   */
  readonly store: ComponentStore
  /**
   * The component metadata.
   */
  readonly model: Model
  /**
   * The field with the form data.
   */
  field?: Field
  /**
   * The parent node in the component data tree.
   */
  parent?: ComponentData
  /**
   * The child nodes in the component data tree.
   */
  children: ComponentData[] = []

  /**
   * User defined properties of the React component.
   */
  userDefinedProps?: Record<string, any>

  /**
   * If true, then validation is in progress.
   */
  validating = false

  /**
   * Specifies the root component for the data in the component tree. **Internal use only.**
   */
  dataRootProvider?: IDataRootProvider

  /**
   * Specifies the index in the array if the component is in the component array.
   * This is not an index in a parent-child structure.
   */
  index?: number

  /**
   * The state of the component. **Internal use only.
   */
  componentState = defaultComponentState

  /**
   * The function for getting initial data. **Internal use only.**
   */
  getInitialData?: () => unknown

  /**
   * The function for updating initial data. **Internal use only.**
   */
  setInitialData?: SetInitialDataFn

  /**
   * Constructor.
   * @param componentStore the component settings.
   * @param model the component metadata for the form viewer.
   * @param childFactory the factory function that creates {@link ComponentData} instance.
   * @param getFormValidationResult the function that returns a form validation results.
   */
  constructor(componentStore: ComponentStore, model: Model,
              childFactory: (componentStore: ComponentStore) => ComponentData,
              getFormValidationResult?: () => Promise<Record<string, string>[]>) {
    this.store = componentStore
    this.model = model
    this.id = uniqueId(`${this.model.type}_`)
    this.#getFormValidatorsResult = getFormValidationResult

    componentStore.children?.forEach(childComponentStore => {
      const child = childFactory(childComponentStore)
      child.setParent(this)
    })

    makeAutoObservable(this, undefined, {name: nameObservable('ComponentData', {key: componentStore.key})})

    const createKeyChangedReaction = () => {
      return reaction(() => this.key, (key, oldKey) => {
        this.invokeOnAfterKeyChanged(this, new ComponentKeyChangedEventArgs(oldKey, key))
      })
    }

    this.#disposers = [createKeyChangedReaction()]
  }

  /**
   * Sets the new parent for this node.
   * @param newParent the new parent.
   */
  setParent(newParent: ComponentData) {
    this.parent?.removeChild(this)
    newParent.addChild(this)
    this.parent = newParent
  }

  /**
   * Inserts the given node after this node.
   * @param inserted the node to insert.
   */
  insertAfterMe(inserted: ComponentData) {
    this.insert(inserted, 'after')
  }

  /**
   * Inserts the given node before this node.
   * @param inserted the node to insert.
   */
  insertBeforeMe(inserted: ComponentData) {
    this.insert(inserted, 'before')
  }

  /**
   * @inheritDoc
   */
  get state() {
    return this._state
  }

  /**
   * @returns the root component for the data in the component tree.
   */
  get dataRoot(): ComponentData {
    return this.dataRootProvider?.dataRoot ?? this.parent?.dataRoot ?? this
  }

  /**
   * @returns the initial data.
   */
  get initialData() {
    return this.dataRoot.getInitialData?.()
  }

  /**
   * Updates the initial data. **Internal use only.**
   * @param key the initial data key.
   * @param value the initial data value.
   */
  updateInitialData(key: string | number, value: unknown) {
    this.dataRoot.setInitialData?.(key, value)
  }

  /**
   * @returns the key of this node (same as the key of the ComponentStore).
   */
  get key(): string {
    return this.store.key
  }

  /**
   * @returns the ComponentDataEvents object.
   */
  get events(): ComponentDataEvents {
    if (!this.#events) {
      this.#events = new ComponentDataEvents()
    }
    return this.#events
  }

  /**
   * Find the node with the given key.
   * @param key the key to find.
   * @returns the node or undefined if not found.
   */
  findByKey(key: string): ComponentData | undefined {
    if (this.key === key) return this
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i]
      const found = child.findByKey(key)
      if (found) return found
    }
    return undefined
  }

  /**
   * Assigns unique keys to the items in the tree.
   * @param root the root of the tree to unify keys. Defaults to the root of this tree.
   * @returns the map of new keys to old keys.
   */
  unifyKeys(root: ComponentData) {
    const keysMap = new Map<string, string>()
    const keysList: string[] = []
    treeForEach(root, ({key}: ComponentData) => {
      keysList.push(key)
    })
    treeForEach(this as ComponentData, item => {
      const newKey = assignNewKey(item.store, new Set(keysList))
      keysMap.set(newKey, item.key)
      keysList.push(newKey)
    })
    return keysMap
  }

  /**
   * Assigns unique keys to the items in the tree.
   */
  unifyTree() {
    const existingKeysMap = new Map<string, Set<ComponentStore>>()
    const root = this as ComponentData

    treeForEach(root, ({key, store}: ComponentData) => {
      const set = existingKeysMap.get(key) ?? new Set<ComponentStore>()
      set.add(store)
      existingKeysMap.set(key, set)
    })

    const existingKeys = new Set<string>(existingKeysMap.keys())

    existingKeysMap.forEach((set, key) => {
      if (set.size <= 1) return
      const items = [...set].slice(1)
      items.forEach(item => {
        const newKey = assignNewKey(item, existingKeys)
        existingKeys.add(newKey)
      })
    })
  }

  /**
   * @returns all the fields in the tree as a map. Starts from this node.
   */
  get fields(): Map<string, Field> {
    const map = this.collectAllFields(new Map<ComponentData, Field>())
    const result = new Map<string, Field>()
    map.forEach((field, componentData) => {
      result.set(dataKey(componentData.store), field)
    })
    return result
  }

  /**
   * @returns an array of all component fields, including non-unique data keys.
   */
  get allComponentFields(): ComponentField[] {
    const map = this.collectAllFields(new Map<ComponentData, Field>())
    const result: ComponentField[] = []
    map.forEach((field, componentData) => {
      result.push({
        dataKey: dataKey(componentData.store),
        field
      })
    })
    return result
  }

  /**
   * @returns an array of all fields, including non-unique data keys.
   */
  get allFields(): Field[] {
    return this.allComponentFields.map(item => item.field)
  }

  /**
   * @returns an array of all children components.
   */
  get allChildren(): ComponentData[] {
    return this.collectAllChildren([])
  }

  /**
   * Deletes this node from the tree.
   */
  delete() {
    this.parent?.removeChild(this)
    const allNodes = this.collectAllNodesAsArray([])
    this.invokeOnBeforeDeleted(allNodes)
    this.disposeNodes(allNodes)
  }

  /**
   * @inheritDoc
   */
  get data() {
    // first, we use the generated form data as the main form object.
    // const result = this.generatedData
    const result: Record<string, unknown> = {...this.generatedData()}
    // secondly, we use the initial data object as additional data.
    const initialObject: Record<string, unknown> = isRecord(this.initialData) ? {...this.initialData} : {}
    return mergeData(result, initialObject)
  }

  /**
   * @returns the generated form data.
   */
  generatedData() {
    const result: Record<string, unknown> = {}
    for (const {dataKey, field} of this.allComponentFields) {
      if (field.storeDataInParentForm) {
        const fieldValue: Record<string, any> = field.value || {}
        Object.keys(fieldValue).forEach(i => result[i] = fieldValue[i])
      } else {
        result[dataKey] = field.value
      }
    }
    return result
  }

  /**
   * @returns the object to read and modify parent data (available for array elements).
   */
  get parentData() {
    const indexExists = typeof this.nearestIndex === 'number'
    if (!indexExists) return undefined
    return this.parent?.data ?? this.rootData
  }

  /**
   * @returns the object to read and modify root form data.
   */
  get rootData() {
    return this.root.data
  }

  /**
   * @returns all the form data that is of the FluentVariable type.
   * Additionally, the keys of the returned object are converted to the snake case.
   */
  get fluentData() {
    const initializedData = getEditableFormData(this)
    return getFluentData(initializedData)
  }

  /**
   * @inheritDoc
   */
  get errors() {
    const result: Record<string, unknown> = {}
    for (const {dataKey, field} of this.allComponentFields) {
      if (field.error) result[dataKey] = field.error
      const errors = field.errors
      if (errors) {
        if (!Array.isArray(errors)) {
          if (field.storeDataInParentForm) Object.keys(errors).forEach(i => result[i] = errors[i])
          if (!field.storeDataInParentForm && Object.keys(errors).length > 0) result[dataKey] = errors
        } else {
          result[dataKey] = errors
        }
      }
    }
    return result
  }

  /**
   * @inheritDoc
   */
  set errors(errors) {
    this.allComponentFields.forEach(item => {
      const error = errors[item.dataKey]
      item.field.setError(error)
    })
  }

  /**
   * @inheritDoc
   */
  get hasErrors() {
    return Object.keys(this.errors).length > 0
  }

  /**
   * @inheritDoc
   */
  setAllErrors(message?: string) {
    this.allFields.forEach(f => f.error = message)
  }

  /**
   * @inheritDoc
   */
  async validate() {
    await this.validateForm()
    return this.errors as ValidationMessages
  }

  /**
   * @inheritDoc
   */
  async getValidationResult() {
    let messages = undefined

    const getFieldMessages = async ({dataKey, field}: ComponentField) => {
      const result = await field.getValidationResult()
      if (isEmpty(result)) return

      messages ??= {}
      let source = messages
      if (!field.storeDataInParentForm) {
        const initialValue = Array.isArray(result) ? [] : {}
        messages[dataKey] ??= initialValue
        source = messages[dataKey]
      }
      merge(source, result)
    }

    await Promise.allSettled(this.allComponentFields.map(getFieldMessages))

    const results = await this.#getFormValidatorsResult?.()
    results?.forEach(result => {
      messages ??= {}
      merge(messages, result)
    })

    return messages
  }

  /**
   * @inheritDoc
   */
  get isValidating() {
    return this.validating
  }

  /**
   * @inheritDoc
   */
  reset(clearInitialData = true) {
    if (clearInitialData) this.clearInitialData()
    // first, disable the response to the data in the fields, so as not to cause a change in the values in the fields
    this.allFields.forEach(f => {
      if (isDataReactionField(f)) f.disableReaction()
      f.reset()
    })
    // then we turn on the reactions to the data in the fields when the changes are completed
    this.allFields.forEach(f => {
      if (isDataReactionField(f)) f.enableReaction()
    })
  }

  /**
   * @inheritDoc
   */
  clear(clearInitialData = true) {
    if (clearInitialData) this.clearInitialData()
    // first, disable the response to the data in the fields, so as not to cause a change in the values in the fields
    this.allFields.forEach(f => {
      if (isDataReactionField(f)) f.disableReaction()
      f.clear()
    })
    // then we turn on the reactions to the data in the fields when the changes are completed
    this.allFields.forEach(f => {
      if (isDataReactionField(f)) f.enableReaction()
    })
  }

  /**
   * Dispose method that releases resources used by the object.
   * It disposes the field and all the children objects.
   */
  dispose() {
    const allNodes = this.collectAllNodesAsArray([])
    this.disposeNodes(allNodes)
  }

  /**
   * @returns true if it has no parent {@link ComponentData}, false otherwise.
   */
  get isRoot() {
    return !this.parent
  }

  /**
   * @returns the root of the component tree.
   */
  get root(): ComponentData {
    return !this.parent ? this : this.parent.root
  }

  /**
   * @returns the index in the array if the component is in the component array
   * (looks for the nearest index in the component hierarchy).
   */
  get nearestIndex(): number | undefined {
    if (!isUndefined(this.index)) return this.index
    return this.parent?.nearestIndex
  }

  private async validateForm() {
    this.validating = true
    try {
      await Promise.allSettled([...this.allFields].map(f => f.validate()))

      const results = await this.#getFormValidatorsResult?.()
      if (!results?.length) return

      const fields = this.allComponentFields
      results.forEach(resultValue => {
        if (!resultValue) return
        fields.forEach(({field, dataKey}) => {
          if (resultValue[dataKey]) return field.setError(resultValue[dataKey])
          if (field.storeDataInParentForm) return field.setError(resultValue)
        })
      })
    } finally {
      this.validating = false
    }
  }

  private insert(inserted: ComponentData, position: 'before' | 'after') {
    const indexAddition = position === 'before' ? 0 : 1
    if (!this.parent) {
      throw new Error(`Cannot insert without parent. Key = ${this.key}`)
    }
    inserted.parent?.removeChild(inserted)
    inserted.parent = this.parent
    const children = this.parent.children
    const index = children.indexOf(this)
    if (index < 0) {
      throw new Error(`Cannot insert not existing element into ComponentData. Key = ${this.key}`)
    }
    children.splice(index + indexAddition, 0, inserted)
    this.parent.store.children ??= []
    const storeChildren = this.parent.store.children
    const storeIndex = storeChildren.indexOf(this.store)
    if (storeIndex < 0) {
      throw new Error(`Cannot insert not existing element into ComponentStore. Key = ${this.key}`)
    }
    storeChildren.splice(storeIndex + indexAddition, 0, inserted.store)
    inserted.store.slot = this.store.slot
    inserted.store.slotCondition = this.store.slotCondition
  }

  /**
   * Disposes the nodes by calling the disposers, disposing the field,
   * and resetting the parent and children properties to undefined and an empty array, respectively.
   * @param nodes the array of ComponentData objects representing the nodes to dispose.
   */
  private disposeNodes(nodes: ComponentData[]) {
    nodes.forEach(componentData => {
      componentData.#events?.dispose()
      componentData.#disposers.forEach(disposer => disposer())
      componentData.field?.dispose()
      componentData.parent = undefined
      componentData.children = []
    })
  }

  private collectAllNodesAsArray(acc: ComponentData[]) {
    acc.push(this)
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i]
      child.collectAllNodesAsArray(acc)
    }
    return acc
  }

  private collectAllFields(acc: Map<ComponentData, Field>) {
    if (this.field) acc.set(this, this.field)
    // we must skip all children if the feature is enabled
    if (this.model.isFeatureEnabled(cfSkipChildrenDuringFieldCollection)) return acc
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i]
      child.collectAllFields(acc)
    }
    return acc
  }

  private collectAllChildren(acc: Array<ComponentData>) {
    acc.push(this)
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i]
      child.collectAllChildren(acc)
    }
    return acc
  }

  private addChild(newChild: ComponentData) {
    if (this.children.indexOf(newChild) < 0) {
      this.children.push(newChild)
    }
    this.store.children ??= []

    if (this.store.children.indexOf(newChild.store) < 0) {
      this.store.children.push(newChild.store)
    }
  }

  private removeChild(oldChild: ComponentData) {
    const index = this.children.indexOf(oldChild)
    if (index > -1) {
      this.children.splice(index, 1)
    }
    this.store.children ??= []
    const storeIndex = this.store.children.indexOf(oldChild.store)
    if (storeIndex > -1) {
      this.store.children.splice(storeIndex, 1)
    }
  }

  private invokeOnAfterKeyChanged(node: ComponentData, eventArgs: ComponentKeyChangedEventArgs) {
    if (this.#events?.onAfterKeyChanged.isSubscribed) {
      this.#events.onAfterKeyChanged.invoke(node, eventArgs)
    }
    this.parent?.invokeOnAfterKeyChanged(node, eventArgs)
  }

  private invokeOnBeforeDeleted(nodes: ComponentData[]) {
    if (this.#events?.onBeforeDelete.isSubscribed) {
      nodes.forEach(node => this.#events?.onBeforeDelete.invoke(node, undefined))
    }
    this.parent?.invokeOnBeforeDeleted(nodes)
  }

  private clearInitialData() {
    const initialData = this.initialData
    if (initialData && isRecord(initialData)) {
      Object.keys(initialData).forEach(key => delete initialData[key])
    }
  }
}

const [
  /**
   * @returns the instance of the ComponentData of the currently rendered component.
   */
  useComponentData,
  /**
   * Context provider for the useComponentData hook. **Internal use only.**
   */
  ComponentDataProvider
] = createNonNullableContext<ComponentData>('ComponentDataContext')

export {useComponentData, ComponentDataProvider}
