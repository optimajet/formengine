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

type Props = Record<string, { value: any }>

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

interface INeedFinalize {
  finalize(): IComponentBuilder
}

function isNeedFinalize(obj: any): obj is INeedFinalize {
  return typeof obj?.finalize === 'function';
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
    return JSON.stringify(this.build())
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
}

/**
 * Creates and returns a new form JSON builder instance.
 * @param options the optional configuration options for the form.
 * @returns the instance of {@link IFormJsonBuilder} to start building the form.
 */
export function buildForm(options?: FormOptions): IFormJsonBuilder {
  return new FormJsonBuilder(options)
}

