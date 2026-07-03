import {JSONSchema7, JSONSchema7Definition} from 'json-schema'
import type {Schema} from 'ts-json-schema-generator'

function isJSONSchema7(obj: unknown): obj is JSONSchema7 {
  return typeof obj === 'object'
}

const addPersistedActionDefinition = (definitions: Schema['definitions']) => {
  if (!definitions) return

  // Define PersistedActionDefinition based on the interface
  definitions.PersistedActionDefinition = {
    type: 'object',
    description: 'The definition of an action.',
    properties: {
      body: {
        type: 'string',
        description: 'The source code of the Action.'
      },
      params: {
        $ref: '#/definitions/ActionParameters',
        description: 'The parameters of the Action.'
      }
    },
    required: ['params']
  }
}

const replaceActionDefinitionReferences = (schema: Schema) => {
  const persistedActionDefinitionRef = '#/definitions/PersistedActionDefinition'

  // Check if this object has a $ref property pointing to ActionDefinition
  if (schema.$ref === '#/definitions/ActionDefinition') {
    schema.$ref = persistedActionDefinitionRef
  }

  const actionValues = schema.definitions?.ActionValues
  if (isJSONSchema7(actionValues) && isJSONSchema7(actionValues.additionalProperties)) {
    actionValues.additionalProperties.$ref = persistedActionDefinitionRef
  }
}

const patchActionData = (definitions: Schema['definitions']) => {
  const actionData = definitions?.ActionData
  if (!isJSONSchema7(actionData)) return

  const actionDataProperties = actionData.properties

  if (actionDataProperties) {
    Object.keys(actionDataProperties)
      .filter(key => key.startsWith('__@KeySymbol'))
      .forEach(key => {
        delete actionDataProperties[key]
      })
  }
}

const patchDisableDataBinding = (definitions: Schema['definitions']) => {
  const componentStoreSchema = definitions?.ComponentStore
  if (!isJSONSchema7(componentStoreSchema)) return

  const disableDataBindingSchema = componentStoreSchema.properties?.disableDataBinding
  if (isJSONSchema7(disableDataBindingSchema)) {
    disableDataBindingSchema.$ref = '#/definitions/ComponentProperty'
  }
}

const addMissingSchemaDescription = (description: string, schema?: JSONSchema7Definition) => {
  if (isJSONSchema7(schema) && !schema.description) {
    schema.description = description
  }
}

const addMissingDescription = (definitions: Schema['definitions']) => {
  const componentStoreSchema = definitions?.ComponentStore
  if (!isJSONSchema7(componentStoreSchema)) return

  addMissingSchemaDescription('The React component key', componentStoreSchema.properties?.key)
  addMissingSchemaDescription('The component type', componentStoreSchema.properties?.type)
}

/**
 * Post-processes the JSON schema by adding/modifying definitions and properties.
 * @param schema the JSON schema to post-process.
 */
export const postProcessSchema = (schema: Schema) => {
  schema.title = 'FormEngine\'s Form Schema'
  replaceActionDefinitionReferences(schema)

  const definitions = schema.definitions
  if (!definitions) return

  addPersistedActionDefinition(definitions)

  // Remove the original ActionDefinition if it exists
  delete definitions.ActionDefinition

  patchActionData(definitions)
  patchDisableDataBinding(definitions)

  addMissingDescription(definitions)

  delete definitions.Func

  if (isJSONSchema7(definitions.LocalizationValue)) {
    delete definitions.LocalizationValue.examples
  }
}

/**
 * Recursively verifies that all schema elements have description fields where applicable
 * and logs missing descriptions to console with full JSON path.
 * @param schema the JSON schema to verify.
 */
export const verifySchema = (schema: Schema) => {
  /**
   * Recursively checks for missing description fields in JSON schema objects
   * @param obj the schema object to check.
   * @param path the current JSON path in the schema.
   */
  const checkDescription = (obj: unknown, path = '') => {
    if (!isJSONSchema7(obj)) return

    // Check if this object should have a description
    if (obj.type || obj.properties || obj.items || obj.anyOf || obj.oneOf || obj.allOf || obj.$ref) {
      if (!obj.description && !obj.$ref && !obj.type) {
        // eslint-disable-next-line no-console
        console.log(`Missing description at path: ${path}`)
      }
    }

    // Recursively check nested objects
    if (obj.properties) {
      Object.entries(obj.properties).forEach(([key, value]) => {
        checkDescription(value, `${path}/properties/${key}`)
      })
    }

    if (obj.items) {
      if (Array.isArray(obj.items)) {
        obj.items.forEach((item, index) => {
          checkDescription(item, `${path}/items[${index}]`)
        })
      } else {
        checkDescription(obj.items, `${path}/items`)
      }
    }

    if (obj.anyOf) {
      obj.anyOf.forEach((item, index) => {
        checkDescription(item, `${path}/anyOf[${index}]`)
      })
    }

    if (obj.oneOf) {
      obj.oneOf.forEach((item, index) => {
        checkDescription(item, `${path}/oneOf[${index}]`)
      })
    }

    if (obj.allOf) {
      obj.allOf.forEach((item, index) => {
        checkDescription(item, `${path}/allOf[${index}]`)
      })
    }

    if (obj.additionalProperties && isJSONSchema7(obj.additionalProperties)) {
      checkDescription(obj.additionalProperties, `${path}/additionalProperties`)
    }

    if (obj.definitions) {
      Object.entries(obj.definitions).forEach(([key, value]) => {
        checkDescription(value, `${path}/definitions/${key}`)
      })
    }
  }

  checkDescription(schema, '')
}
