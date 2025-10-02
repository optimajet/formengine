import {boolean, color, define, number, oneOf, string} from '@react-form-builder/core'
import {Progress} from 'rsuite'
import {staticCategory} from './categories'

const rsCommonProgressProps = {
  classPrefix: string.default('progress').hinted('The prefix of the component CSS class'),
  percent: number.default(50)
    .withEditorProps({min: 0, max: 100})
    .hinted('Percent of progress')
    .dataBound,
  showInfo: boolean.default(true).hinted('Show text'),
  status: oneOf('success', 'fail', 'active')
    .default('active')
    .hinted('Progress status')
    .withEditorProps({creatable: false}),
  strokeColor: color.hinted('Line color'),
  strokeWidth: number.hinted('Line width'),
}

export const rsProgressCircle = define(Progress.Circle, 'RsProgressCircle')
  .name('Progress circle')
  .category(staticCategory)
  .props({
    ...rsCommonProgressProps,
    gapDegree: number.withEditorProps({min: 0, max: 360}).hinted('The gap degree of half circle, 0 ~ 360'),
    gapPosition: oneOf('right', 'top', 'bottom', 'left')
      .default('top')
      .hinted('Circular progress bar Notch position')
      .withEditorProps({creatable: false}),
    strokeLinecap: oneOf('round', 'square', 'butt')
      .default('round')
      .hinted('The end of different types of open paths')
      .withEditorProps({creatable: false}),
    strokeWidth: number.default(6).hinted('Line width'),
    trailColor: color.hinted('Trail color'),
    trailWidth: number.default(6).hinted('Trail width')
  })

export const rsProgressLine = define(Progress.Line, 'RsProgressLine')
  .name('Progress line')
  .category(staticCategory)
  .props({
    ...rsCommonProgressProps,
    vertical: boolean.default(false).hinted('The progress bar is displayed vertically')
  })
