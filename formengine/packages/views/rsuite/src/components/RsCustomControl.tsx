import {define} from '@react-form-builder/core'

interface RsCustomControlProps {

}

const RsCustomControl = (props: RsCustomControlProps) => {
  return (<>CustomControl</>)
}

export const rsCustomControl = define(RsCustomControl, 'RsCustomControl')
  .name('Custom control')
  .preview(<span>This is custom preview 🎉🚉🪆</span>)
