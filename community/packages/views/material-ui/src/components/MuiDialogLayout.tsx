import {definePreset} from '@react-form-builder/core'
import {layoutCategory} from './categories'

const rawComponents = [
  {
    'type': 'MuiDialogTitle',
    'props': {}
  },
  {
    'type': 'MuiDialogContent',
    'props': {},
    'children': [
      {
        'type': 'MuiDialogContentText',
        'props': {},
      }
    ]
  },
  {
    'type': 'MuiDialogActions',
    'props': {},
    'children': [
      {
        'type': 'MuiButton',
        'props': {
          'children': {
            'value': 'Disagree'
          }
        },
        'events': {
          'onClick': [
            {
              'name': 'closeModal',
              'type': 'common'
            }
          ]
        },
        'wrapperCss': {
          'any': {
            'object': {
              'width': 'auto'
            }
          }
        }
      },
      {
        'type': 'MuiButton',
        'props': {
          'children': {
            'value': 'Agree'
          }
        },
        'events': {
          'onClick': [
            {
              'name': 'closeModal',
              'type': 'common'
            }
          ]
        },
        'wrapperCss': {
          'any': {
            'object': {
              'width': 'auto'
            }
          }
        }
      }
    ]
  }
]

const componentStores = rawComponents.map(component => {
  return JSON.parse(JSON.stringify(component))
})

export const muiDialogLayout = definePreset('MuiDialogLayout', componentStores)
  .icon('Card')
  .category(layoutCategory)
