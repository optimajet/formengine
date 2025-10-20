import {useBuilderMode} from '../../utils/contexts/BuilderModeContext'
import {useStore} from '../../utils/contexts/StoreContext'
import {isUndefined} from '../../utils/tools'
import {array, containerStyles, getDefaultCss, node, string} from '../annotation'
import {toArray} from '../annotation/toArray'
import {toStyleProperties} from '../annotation/toStyleProperties'
import {Model} from '../define'
import {addOrUpdateFeatures} from '../define/utils/ComponentFeature'
import {cfSkipChildrenDuringFieldCollection} from '../define/utils/integratedComponentFeatures'
import {RepeaterItem} from './RepeaterItem'
import type {RepeaterProps} from './RepeaterProps'
import {RepeaterPropsProvider} from './RepeaterPropsContext'

type RepeaterContainerProps = Pick<RepeaterProps, 'wrapperClassName' | 'children'>

const RepeaterContainer = (props: RepeaterContainerProps) => {
  const viewerMode = useBuilderMode() === 'viewer'
  const store = useStore()
  const insideTemplate = store.parentStore

  if (viewerMode && !props.children) return null

  return <div className={props.wrapperClassName}>
    {viewerMode || insideTemplate
      ? props.children
      : <RepeaterItem>{props.children}</RepeaterItem>
    }
  </div>
}

const Repeater = (props: RepeaterProps) =>
  <RepeaterPropsProvider value={props}>
    <RepeaterContainer wrapperClassName={props.wrapperClassName}>
      {props.children}
    </RepeaterContainer>
  </RepeaterPropsProvider>
Repeater.displayName = 'Repeater'

export const repeaterValuedAnnotation = array.valued
  .setup({editor: 'arrayOfObject'})

export const repeaterProps = toArray<RepeaterProps>({
  itemRenderWhen: string.notLocalize
    .hinted('The expression or function to conditionally render a repeater item.'),
  value: repeaterValuedAnnotation,
  children: node,
})

const {flexDirection, gap} = containerStyles

export const repeaterItemStyleProperties = toStyleProperties({
  display: string.default('flex').hideEditor(),
  flexDirection: flexDirection.default('column').named('Item direction').hinted('Item direction'),
  gap: gap.default('20px').named('Item gap').hinted('Item gap')
})

const repeaterItemCss = getDefaultCss(repeaterItemStyleProperties)

export const repeaterWrapperStyleProperties = toStyleProperties({
  display: string.default('flex').hideEditor(),
  flexDirection: flexDirection.default('column').hinted('Repeater direction'),
  gap: gap.default('20px').hinted('Repeater gap')
})

const repeaterWrapperCss = getDefaultCss(repeaterWrapperStyleProperties)

const repeaterDefaultProps = repeaterProps
  .filter(an => !isUndefined(an.default))
  .reduce<Record<string, any>>((acc, an) => {
    acc[an.key] = an.default
    return acc
  }, {})

const repeaterFeatures = addOrUpdateFeatures({},
  {name: cfSkipChildrenDuringFieldCollection, value: true},
)

export const repeaterModel = new Model(Repeater, 'Repeater', undefined, 'value', 'array',
  repeaterDefaultProps, repeaterItemCss, repeaterWrapperCss, 'Repeater', 'repeater',
  undefined, undefined, undefined, undefined, undefined, repeaterFeatures)
