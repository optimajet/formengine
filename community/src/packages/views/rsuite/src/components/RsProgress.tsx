import {boolean, color, define, number, oneOf, string} from '@react-form-builder/core'
import {Progress} from 'rsuite'
import {staticCategory} from './categories'

const rsCommonProgressProps = {
  classPrefix: string.default('progress'),
  percent: number.default(50)
    .withEditorProps({min: 0, max: 100})
    .dataBound,
  showInfo: boolean.default(true),
  status: oneOf('success', 'fail', 'active')
    .default('active')
    .withEditorProps({creatable: false}),
  strokeColor: color,
  strokeWidth: number,
}

export const rsProgressCircle = define(Progress.Circle, 'RsProgressCircle')
  .name('Progress circle')
  .category(staticCategory)
  .props({
    ...rsCommonProgressProps,
    gapDegree: number.withEditorProps({min: 0, max: 360}),
    gapPosition: oneOf('right', 'top', 'bottom', 'left')
      .default('top')
      .withEditorProps({creatable: false}),
    strokeLinecap: oneOf('round', 'square', 'butt')
      .default('round')
      .withEditorProps({creatable: false}),
    strokeWidth: number.default(6),
    trailColor: color,
    trailWidth: number.default(6)
  })

export const rsProgressLine = define(Progress.Line, 'RsProgressLine')
  .name('Progress line')
  .category(staticCategory)
  .props({
    ...rsCommonProgressProps,
    vertical: boolean.default(false)
  })
