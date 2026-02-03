import type {FormProps, IChangeEvent} from '@rjsf/core'
import type {RJSFSchema, UiSchema, ValidatorType} from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'

interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

const schema: RJSFSchema = {
  title: 'Login',
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      title: 'Email',
      format: 'email',
      default: '',
    },
    password: {
      type: 'string',
      title: 'Password',
      minLength: 6,
      default: '',
    },
    rememberMe: {
      type: 'boolean',
      title: 'Remember me',
      default: true,
    },
  },
}
const uiSchema: UiSchema<LoginFormData> = {
  password: {
    'ui:widget': 'password',
  },
}
const handleSubmit = (event: IChangeEvent<LoginFormData>) => {
  console.warn('Login data', event.formData)
}

interface LoginFormProps {
  formComponent: React.ComponentType<FormProps<LoginFormData>>
}

export function App({formComponent}: LoginFormProps) {
  const Form = formComponent
  return <Form schema={schema} uiSchema={uiSchema} validator={validator as ValidatorType<LoginFormData>} onSubmit={handleSubmit} />
}
