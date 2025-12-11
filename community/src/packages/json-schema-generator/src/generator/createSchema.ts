import type {Annotation, BuilderComponent, ComponentLibraryDescription, I18nItem} from '@react-form-builder/core'
import {cfHideFromComponentPalette, ContainerAnnotation, EventAnnotation} from '@react-form-builder/core'
import baseSchema from '@react-form-builder/core/schemas/persisted-form.schema.json'
import type {JSONSchema} from 'json-schema-typed/draft_07'

const functionIf = {
  if: {
    properties: {
      computeType: {
        const: 'function'
      }
    },
    required: ['computeType']
  },
  then: {
    required: ['fnSource']
  }
} as const

const localizationIf = {
  if: {
    properties: {
      computeType: {
        const: 'localization'
      }
    },
    required: ['computeType']
  },
  then: {
    not: {required: ['value', 'fnSource']}
  }
} as const

const valueIf = {
  if: {
    not: {required: ['computeType']}
  },
  then: {required: ['value']}
} as const

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * Supported JSON schema types mapping from annotation types
 */
const supportedTypes: Record<string, string | undefined> = {
  string: 'string',
  boolean: 'boolean',
  array: 'array',
  number: 'number',
  object: 'object',
  date: 'string',
  time: 'string',
  unknown: undefined,
}

const screenType = 'Screen'
const componentSchemaPostfix = 'ComponentStore'
const abstractComponentStoreName = 'AbstractComponentStore'
const childrenPropertySchemaName = 'childrenProperty'

const getDefinitionRef = (definition: string) => {
  return `#/definitions/${definition}`
}

const getOrCreatePropertySchema = (annotation: Annotation,
                                   propertySchemas: Map<string, JSONSchema>) => {
  const type = supportedTypes[annotation.type ?? 'unknown']

  let schemaName = `${annotation.type}Property`
  let description = `${annotation.type} property type`
  if (annotation.calculable) {
    schemaName = `${schemaName}Calculable`
    description = `${description}, calculable`
  }
  if (annotation.localizable) {
    schemaName = `${schemaName}Localizable`
    description = `${description}, localizable`
  }

  if (propertySchemas.has(schemaName)) return schemaName

  const properties: Record<string, JSONSchema> = {
    value: {
      type,
      description: `The simple value of a '${annotation.type}' component property.`
    },
  }

  if (annotation.calculable) {
    properties.fnSource = {
      type: 'string',
      description: `Source code of the function for calculating the value of a '${annotation.key}' component property.`
    }
  }

  if (annotation.localizable || annotation.calculable) {
    const enumValues: string[] = []
    if (annotation.localizable) enumValues.push('localization')
    if (annotation.calculable) enumValues.push('function')
    properties.computeType = {
      type: 'string',
      enum: enumValues,
      description: 'Type of the component\'s calculated property. If not specified - the value from value is used.'
    }
  }

  const result: JSONSchema = {
    type: 'object',
    properties,
    description,
  }

  propertySchemas.set(schemaName, result)

  if (!annotation.localizable && !annotation.calculable) {
    result.required = ['value']
    return schemaName
  }

  if (annotation.localizable && annotation.calculable) {
    result.allOf = [
      functionIf,
      localizationIf,
      valueIf,
    ]
    return schemaName
  }

  if (annotation.localizable) {
    result.allOf = [
      localizationIf,
      valueIf,
    ]
    return schemaName
  }

  result.allOf = [
    functionIf,
    valueIf,
  ]
  return schemaName
}

const generateComponentPropertySchema = (annotation: Annotation,
                                         propertySchemas: Map<string, JSONSchema>,
                                         propertyDescription?: I18nItem): JSONSchema | undefined => {
  const schemaName = getOrCreatePropertySchema(annotation, propertySchemas)
  if (!schemaName) return

  return {
    type: 'object',
    $ref: getDefinitionRef(schemaName),
    description: propertyDescription?.description,
  }
}

const generateComponentSchema = (component: BuilderComponent,
                                 propertySchemas: Map<string, JSONSchema>,
                                 descriptions?: ComponentLibraryDescription[]) => {
  const {meta, model} = component
  const libraryDescription = descriptions?.find(d => d.components?.[model.type])
  const componentDescription = libraryDescription?.components?.[model.type]

  const schema: JSONSchema = {}

  if (isBoolean(schema)) return schema

  if (componentDescription?.description) {
    schema.description = componentDescription?.description
  }

  schema.properties ??= {}
  const properties = schema.properties
  properties.type = {type: 'string', const: meta.type, description: 'The component type'}

  const requiredProps: string[] = []
  properties.props = {
    type: 'object',
    description: `The ${meta.type} component properties.`,
    required: requiredProps,
    properties: {}
  }

  const props = properties.props

  let hasNodes = false
  meta.properties.forEach(annotation => {
    if (annotation instanceof EventAnnotation) return

    if (annotation instanceof ContainerAnnotation) hasNodes = true
    const propertyDescription = componentDescription?.props?.[annotation.key]
      ?? libraryDescription?.commonProperties?.[annotation.key]

    props.properties ??= {}
    const property = generateComponentPropertySchema(annotation, propertySchemas, propertyDescription)
    if (property) {
      props.properties[annotation.key] = property
      if (annotation.required && !annotation.default) requiredProps.push(annotation.key)
    }
  })

  props.properties ??= {}
  props.properties.additionalProperties = false

  if (model.kind === 'container' || hasNodes) {
    properties.children = {
      $ref: getDefinitionRef(childrenPropertySchemaName),
      description: 'The array of child components.'
    }
  }

  schema.required = requiredProps.length ? ['type', 'props'] : ['type']

  if (!properties.props.required?.length) {
    delete properties.props.required
  }

  return {
    allOf: [
      {
        $ref: getDefinitionRef(abstractComponentStoreName),
      },
      schema,
    ]
  }
}

const addComponentTypeRestrictions = (schemaProperty: JSONSchema, enumValues: string[]) => {
  if (schemaProperty && !isBoolean(schemaProperty) && enumValues.length) {
    schemaProperty.enum = enumValues
  }
}

const createComponentSchema = (builderComponent: BuilderComponent,
                               propertySchemas: Map<string, JSONSchema>,
                               descriptions?: ComponentLibraryDescription[]) => {
  const {model} = builderComponent
  const name = `${(model.type)}${componentSchemaPostfix}`
  const schema = generateComponentSchema(builderComponent, propertySchemas, descriptions)
  return {name, schema} as const
}

const createScreenSchema = (allComponents: BuilderComponent[],
                            propertySchemas: Map<string, JSONSchema>,
                            descriptions?: ComponentLibraryDescription[]) => {
  const screenComponent = allComponents.find(({model}) => model.type === screenType)
  if (screenComponent) return createComponentSchema(screenComponent, propertySchemas, descriptions)
}

/**
 * Creates the JSON Schema for builder components.
 * @param components the components to generate schema for.
 * @param descriptions the component descriptions to include in the schema.
 * @returns the generated JSON Schema with definitions for each builder component.
 */
export const createSchema = (components: BuilderComponent[],
                             descriptions?: ComponentLibraryDescription[]) => {
  const errorTypes: string [] = []
  const tooltipTypes: string [] = []
  const modalTypes: string [] = []

  const allComponents = [...components]
  const schemas: any[] = []
  const propertySchemas = new Map<string, JSONSchema>()

  allComponents.forEach(builderComponent => {
    const {model} = builderComponent

    if (model.hasComponentRole('error-message')) errorTypes.push(model.type)
    if (model.hasComponentRole('tooltip')) tooltipTypes.push(model.type)
    if (model.hasComponentRole('modal')) modalTypes.push(model.type)

    if (model.isFeatureEnabled(cfHideFromComponentPalette)) return

    const componentSchema = createComponentSchema(builderComponent, propertySchemas, descriptions)
    schemas.push(componentSchema)
  })


  const result: JSONSchema = JSON.parse(JSON.stringify(baseSchema))

  if (isBoolean(result)) return result

  result.definitions ??= {}
  const definitions = result.definitions

  const refs: any[] = []
  schemas.forEach(item => {
    definitions[item.name] = item.schema
    refs.push({$ref: getDefinitionRef(item.name)})
  })

  const screenSchema = createScreenSchema(allComponents, propertySchemas, descriptions)
  if (screenSchema) {
    definitions[screenSchema.name] = screenSchema.schema
  }

  const abstractComponentStore = JSON.parse(JSON.stringify(baseSchema.definitions.ComponentStore))
  abstractComponentStore.required = ['key']
  if (abstractComponentStore.properties) {
    delete abstractComponentStore.properties.type
    delete abstractComponentStore.properties.props
    delete abstractComponentStore.properties.slotCondition
    delete abstractComponentStore.properties.children
  }

  delete definitions.ComponentStore
  delete definitions['ComponentProperty<boolean>']
  definitions[abstractComponentStoreName] = abstractComponentStore

  const childrenPropertySchema = {
    type: 'array',
    items: {
      anyOf: refs
    }
  } as const
  propertySchemas.set(childrenPropertySchemaName, childrenPropertySchema)
  propertySchemas.forEach((schema, name) => {
    definitions[name] = schema
  })

  result.properties ??= {}
  addComponentTypeRestrictions(result.properties.errorType, errorTypes)
  addComponentTypeRestrictions(result.properties.tooltipType, tooltipTypes)
  addComponentTypeRestrictions(result.properties.modalType, modalTypes)

  // the root of the form is the Screen component
  if (screenSchema && !isBoolean(result.properties.form)) {
    result.properties.form.$ref = getDefinitionRef(`${screenType}${componentSchemaPostfix}`)
  }

  result.title = 'FormEngine JSON schema'
  result.description = 'The scheme describes the JSON structure and the set of components used'

  return result
}
