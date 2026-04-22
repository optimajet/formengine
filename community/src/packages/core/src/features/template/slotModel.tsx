import type {Store} from '../../stores/Store'
import {ComponentDataProvider, useComponentData} from '../../utils/contexts/ComponentDataContext'
import {StoreProvider, useStore} from '../../utils/contexts/StoreContext'
import {namedObserver} from '../../utils/namedObserver'
import {addOrUpdateFeatures} from '../define/utils/ComponentFeature'
import {
  cfDisableAdditionalProperties,
  cfDisableMainComponentProperties,
  cfDisableStyleProperties,
  cfDisableTooltipProperties
} from '../define/utils/integratedComponentFeatures'
import {Model} from '../define/utils/Model'
import {ViewerPropsProvider} from '../form-viewer/components/ViewerPropsContext'
import {useEmbeddedForm} from './EmbeddedForm'
import styles from './slotModel.module.css'

const RawSlotContent = ({parentStore}: { parentStore: Store }) => {
  const {key} = useComponentData()
  const {viewerProps, data, embeddedFormProps} = useEmbeddedForm()

  return (
    <StoreProvider value={parentStore}>
      <ViewerPropsProvider value={viewerProps}>
        <ComponentDataProvider value={data}>
          {embeddedFormProps[key]}
        </ComponentDataProvider>
      </ViewerPropsProvider>
    </StoreProvider>
  )
}

const SlotContent = namedObserver('SlotContent', RawSlotContent)

const RawSlotPlaceholder = () => {
  const {key} = useComponentData()
  return <div className={styles.slotPlaceholder}>{`Slot: '${key}'`}</div>
}

const SlotPlaceholder = namedObserver('SlotPlaceholder', RawSlotPlaceholder)

const Slot = () => {
  const {parentStore} = useStore()
  return parentStore
    ? <SlotContent parentStore={parentStore}/>
    : <SlotPlaceholder/>
}
const typeName = 'Slot'

const slotFeatures = addOrUpdateFeatures({},
  {name: cfDisableMainComponentProperties, value: true},
  {name: cfDisableTooltipProperties, value: true},
  {name: cfDisableStyleProperties, value: true},
  {name: cfDisableAdditionalProperties, value: true},
)

/**
 * Form viewer slot metadata. **Internal use only.**
 */
export const slotModel = new Model(Slot, typeName, undefined, undefined, undefined,
  undefined, undefined, undefined, typeName, undefined, undefined, undefined,
  undefined, undefined, undefined, slotFeatures)
