import type {ComponentProperty} from '../../stores/ComponentStore'
import type {LocalizationValue} from '../../stores/LocalizationStore'
import type {LanguageFullCode} from '../localization/types'
import type {Device, FormOptions, IComponentBuilder, IEventHandlerBuilder, IFormJsonBuilder, IValidationBuilder} from './types'

type Event = {
  name: string
  type: string
  args?: any
}

type Validation = {
  key: string
  args?: any
}

type SimplePropValue = {
  value: any
}

type LocalizedPropValue = {
  values: Record<LanguageFullCode, any>
  localized: boolean
}

type ComputedPropValue = {
  fnSource: string
}

type PropValue = SimplePropValue | LocalizedPropValue | ComputedPropValue

type Props = Record<string, PropValue>

type Css = {
  [device in Device]?: {
    object?: Record<string, string>
    string?: string
  }
}

type Component = {
  key: string
  type: string
  props?: Props
  schema?: { validations: Validation[] }
  events?: Record<string, Event[]>
  css?: Css
  children?: Component[]
}

type Form = {
  key: string
  type: string
  children?: Component[]
}

type FormRoot = {
  form: Form
}

type LocalizedForm = FormRoot & {
  localization?: LocalizationValue
  languages?: Array<{
    code: string
    dialect: string
  }>
}

interface INeedFinalize {
  finalize(): IComponentBuilder
}

function isComputedProp(value: any): value is ComputedPropValue {
  return !!(value?.['fnSource'])
}

function isLocalizedProp(value: any): value is LocalizedPropValue {
  return value?.['localized'] === true
}

function isNeedFinalize(obj: any): obj is INeedFinalize {
  return typeof obj?.finalize === 'function'
}

class EventHandlerBuilder implements IEventHandlerBuilder, INeedFinalize {
  private buffer: Event[] = []
  private current: Event | null = null

  constructor(private parent: ComponentBuilder, private eventName: string) {
  }

  /**
   * @inheritDoc
   */
  commonAction(name: string): IEventHandlerBuilder {
    this.commit()
    this.current = {type: 'common', name: name}
    return this
  }

  /**
   * @inheritDoc
   */
  customAction(name: string): IEventHandlerBuilder {
    this.commit()
    this.current = {type: 'custom', name: name}
    return this
  }

  /**
   * @inheritDoc
   */
  args(val: any): IEventHandlerBuilder {
    if (!this.current) throw new Error('Call default or custom before args')
    this.current.args = val
    return this
  }

  /**
   * @inheritDoc
   */
  prop = (key: string, value: any): IComponentBuilder => this.finalize().prop(key, value)

  /**
   * @inheritDoc
   */
  localizedProp = (key: string, language: LanguageFullCode, value: any): IComponentBuilder => {
    return this.finalize().localizedProp(key, language, value)
  }

  /**
   * @inheritDoc
   */
  computedProp = (key: string, value: string): IComponentBuilder => this.finalize().computedProp(key, value)

  /**
   * @inheritDoc
   */
  validation = (key: string) => this.finalize().validation(key)

  /**
   * @inheritDoc
   */
  event = (eventName: string): IEventHandlerBuilder => this.finalize().event(eventName)

  /**
   * @inheritDoc
   */
  component = (key: string, type: string): IComponentBuilder => this.finalize().component(key, type)

  /**
   * @inheritDoc
   */
  json = (): string => this.finalize().json()

  /**
   * @inheritDoc
   */
  style = (value: string, device?: Device): IComponentBuilder => this.finalize().style(value, device)

  /**
   * @inheritDoc
   */
  children = (childrenBuilder: (builder: IFormJsonBuilder) => IFormJsonBuilder): IComponentBuilder => this.finalize().children(childrenBuilder)

  finalize(): IComponentBuilder {
    this.commit()
    this.parent.events = {}
    for (const evt of this.buffer) {
      this.parent.addEvent(this.eventName, evt)
    }
    return this.parent
  }

  private commit() {
    if (this.current) {
      this.buffer.push(this.current)
      this.current = null
    }
  }
}

class ValidationBuilder implements IValidationBuilder, INeedFinalize {
  constructor(private parent: ComponentBuilder, private key: string) {
  }

  /**
   * @inheritDoc
   */
  args(val: any): IComponentBuilder {
    this.finalize(val)
    return this.parent
  }

  /**
   * @inheritDoc
   */
  prop = (key: string, value: any): IComponentBuilder => this.finalize().prop(key, value)

  /**
   * @inheritDoc
   */
  localizedProp = (key: string, language: LanguageFullCode, value: any): IComponentBuilder => {
    return this.finalize().localizedProp(key, language, value)
  }

  /**
   * @inheritDoc
   */
  computedProp = (key: string, value: string): IComponentBuilder => this.finalize().computedProp(key, value)

  /**
   * @inheritDoc
   */
  validation = (key: string) => this.finalize().validation(key)

  /**
   * @inheritDoc
   */
  event = (eventName: string): IEventHandlerBuilder => this.finalize().event(eventName)

  /**
   * @inheritDoc
   */
  component = (key: string, type: string): IComponentBuilder => this.finalize().component(key, type)

  /**
   * @inheritDoc
   */
  json = (): string => this.finalize().json()

  /**
   * @inheritDoc
   */
  style = (value: string, device?: Device): IComponentBuilder => this.finalize().style(value, device)

  /**
   * @inheritDoc
   */
  children = (childrenBuilder: (builder: IFormJsonBuilder) => IFormJsonBuilder): IComponentBuilder => this.finalize().children(childrenBuilder)

  finalize(val?: any): IComponentBuilder {
    this.parent.addValidation(this.key, val)
    return this.parent
  }
}

class ComponentBuilder implements IComponentBuilder {
  props: Props = {}
  validations: Validation[] = []
  events: Record<string, Event[]> = {}
  css: Css = {}
  childComponents: Component[] = []

  constructor(public parent: FormJsonBuilder | ComponentBuilder, public key: string, public type: string) {
  }

  /**
   * @inheritDoc
   */
  prop(key: string, value: any): IComponentBuilder {
    this.props[key] = {value}
    return this
  }

  /**
   * @inheritDoc
   */
  localizedProp(key: string, language: LanguageFullCode, value: any): IComponentBuilder {
    const prop = this.props[key]
    if (isLocalizedProp(prop)) {
      prop.values[language] = value
    } else {
      this.props[key] = {localized: true, values: {[language]: value}}
    }
    return this
  }

  /**
   * @inheritDoc
   */
  computedProp(key: string, value: string): IComponentBuilder {
    this.props[key] = {fnSource: value}
    return this
  }

  /**
   * @inheritDoc
   */
  validation(key: string): IValidationBuilder {
    return new ValidationBuilder(this, key)
  }

  /**
   * @inheritDoc
   */
  event(eventName: string): IEventHandlerBuilder {
    return new EventHandlerBuilder(this, eventName)
  }

  buildComponent(): Component {
    const result: Component = {
      key: this.key,
      type: this.type,
      props: this.props
    }
    if (this.validations.length) result.schema = {validations: this.validations}
    if (Object.keys(this.events).length) result.events = this.events
    if (Object.keys(this.css).length) result.css = this.css
    if (this.childComponents.length) result.children = this.childComponents
    return result
  }

  addEvent(name: string, event: Event) {
    if (!this.events[name]) this.events[name] = []
    this.events[name].push(event)
  }

  addValidation(key: string, val?: any) {
    this.validations.push({key, args: val})
  }

  /**
   * @inheritDoc
   */
  style(value: string | Record<string, string>, device?: Device): IComponentBuilder {
    const style = (this.css[device ?? 'any'] ??= {})
    if (typeof value === 'object') {
      style.object = {...style.object, ...value}
      return this
    }
    style.string = value
    return this
  }

  /**
   * @inheritDoc
   */
  children(children: (builder: IFormJsonBuilder) => IFormJsonBuilder): IComponentBuilder {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const builder = new FormJsonBuilder()
    const builderResult = children(builder)
    if (isNeedFinalize(builderResult)) {
      builderResult.finalize()
    }
    this.childComponents = [
      ...this.childComponents,
      ...builder.build().form.children ?? []
    ]
    return this
  }

  /**
   * @inheritDoc
   */
  json = (): string => this.parent.json()

  /**
   * @inheritDoc
   */
  component = (key: string, type: string): IComponentBuilder => this.parent.component(key, type)
}

class FormJsonBuilder implements IFormJsonBuilder {
  private components: Component[] = []
  private current: ComponentBuilder | null = null

  constructor(private options?: FormOptions) {
  }

  /**
   * @inheritDoc
   */
  component(key: string, type: string): IComponentBuilder {
    if (this.current) {
      this.components.push(this.current.buildComponent())
    }
    this.current = new ComponentBuilder(this, key, type)
    return this.current
  }

  /**
   * @inheritDoc
   */
  json(): string {
    const built = this.build()
    // root will be changed, so we will create a copy of this object
    const root = JSON.parse(JSON.stringify(built)) as LocalizedForm
    const localization: LocalizationValue = {}

    this.toComponentProperties(root.form, localization)
    if (Object.keys(localization).length > 0) {
      root.localization = localization
      root.languages = this.toLanguages(localization)
    }

    return JSON.stringify(root)
  }

  build(): FormRoot {
    if (this.current) {
      this.components.push(this.current.buildComponent())
      this.current = null
    }
    const form: FormRoot = {
      ...this.options,
      form: {
        key: 'Screen',
        type: 'Screen'
      }
    }
    if (this.components.length) {
      form.form.children = this.components
    }
    return form
  }

  private toLanguages(localization: LocalizationValue) {
    return Object.keys(localization).map(langCode => {
      const [code, dialect] = langCode.split('-')
      return {
        code,
        dialect: dialect ?? code
      }
    })
  }

  private toComponentProperties(form: Form & { props?: Props }, localization: LocalizationValue) {
    const props: Record<string, PropValue | ComponentProperty> = form.props ?? {}

    Object.entries(props).forEach(([key, value]) => {
      if (isComputedProp(value)) {
        props[key] = {computeType: 'function', fnSource: value.fnSource}
        return
      }

      if (isLocalizedProp(value)) {
        props[key] = {computeType: 'localization'}
        Object.entries(value.values).forEach(([language, val]) => {
          const langKey = language as LanguageFullCode
          localization[langKey] ??= {}
          localization[langKey][form.key] ??= {}
          localization[langKey][form.key]['component'] ??= {}
          localization[langKey][form.key]['component']![key] = val
        })
      }
    })

    const children = form.children ?? []
    children.forEach(child => {
      this.toComponentProperties(child, localization)
    })
  }
}

/**
 * Creates and returns a new form JSON builder instance.
 * @param options the optional configuration options for the form.
 * @returns the instance of {@link IFormJsonBuilder} to start building the form.
 */
export function buildForm(options?: FormOptions): IFormJsonBuilder {
  return new FormJsonBuilder(options)
}

