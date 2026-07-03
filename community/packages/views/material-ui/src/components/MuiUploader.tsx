import {definePreset} from '@react-form-builder/core'
import {inputsCategory} from './categories'

const rawComponents = [
  {
    key: 'uploaderContainer',
    type: 'MuiContainer',
    props: {
      disableGutters: {
        value: true,
      },
      fixed: {
        value: false,
      },
    },
    children: [
      {
        key: 'uploader1',
        type: 'Uploader',
        props: {
          action: {
            value: 'http://localhost:3001/upload',
          },
          children: {
            editorType: 'node',
          },
          dropzone: {
            value: false,
          },
        },
        children: [
          {
            key: 'muiButton1',
            type: 'MuiButton',
            props: {
              variant: {
                value: 'contained',
              },
              children: {
                value: 'Upload',
              },
            },
          },
        ],
      },
    ],
  },
  {
    key: 'muiList1',
    type: 'MuiList',
    props: {
      dense: {
        value: true,
      },
      disablePadding: {
        value: true,
      },
    },
    children: [
      {
        key: 'repeater1',
        type: 'Repeater',
        props: {
          value: {
            computeType: 'function',
            fnSource: 'return form.data.uploader1?.map(item => item)',
          },
        },
        wrapperCss: {
          any: {
            object: {
              gap: '0px',
            },
          },
        },
        children: [
          {
            key: 'muiListItem1',
            type: 'MuiListItem',
            props: {
              divider: {
                value: true,
              },
            },
            children: [
              {
                key: 'muiTypography1',
                type: 'MuiTypography',
                props: {
                  className: {
                    computeType: 'function',
                    fnSource: "    return form.data.status === 'error' ? 'error' : 'success'",
                  },
                  children: {
                    computeType: 'function',
                    fnSource:
                      "    const {url, error, name, status} = form.data\n\n    return url ?? `${name ?? 'File name'} - ${error ?? status ?? 'status'}`",
                    value: '',
                  },
                },
                css: {
                  any: {
                    string: '    &.error {\n        color: red;\n    }',
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
]

const componentStores = rawComponents.map(component => {
  return JSON.parse(JSON.stringify(component))
})

export const muiUploader = definePreset('MuiUploader', componentStores)
  .icon('Uploader')
  .category(inputsCategory)
