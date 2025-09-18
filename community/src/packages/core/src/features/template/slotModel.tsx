import type {CSSProperties} from 'react'
import type {Store} from '../../stores/Store'
import {namedObserver} from '../../utils'
import {ComponentDataProvider, useComponentData} from '../../utils/contexts/ComponentDataContext'
import {StoreProvider, useStore} from '../../utils/contexts/StoreContext'
import {Model} from '../define'
import {addOrUpdateFeatures} from '../define/utils/ComponentFeature'
import {
  cfDisableAdditionalProperties,
  cfDisableMainComponentProperties,
  cfDisableStyleProperties,
  cfDisableTooltipProperties
} from '../define/utils/integratedComponentFeatures'
import {ViewerPropsProvider} from '../form-viewer/components/ViewerPropsContext'
import {useTemplate} from './templateModel'

const RawSlotContent = ({parentStore}: { parentStore: Store }) => {
  const {key} = useComponentData()
  const {viewerProps, data, templateProps} = useTemplate()

  return (
    <StoreProvider value={parentStore}>
      <ViewerPropsProvider value={viewerProps}>
        <ComponentDataProvider value={data}>
          {templateProps[key]}
        </ComponentDataProvider>
      </ViewerPropsProvider>
    </StoreProvider>
  )
}

const SlotContent = namedObserver('SlotContent', RawSlotContent)

const slotPlaceholder: CSSProperties = {
  backgroundColor: 'rgb(150, 150, 150, 25%)',
  padding: 5
}

const RawSlotPlaceholder = () => {
  const {key} = useComponentData()
  return <div style={slotPlaceholder}>{`Slot: '${key}'`}</div>
}

const SlotPlaceholder = namedObserver('SlotPlaceholder', RawSlotPlaceholder)

const Slot = () => {
  const {parentStore} = useStore()
  return parentStore
    ? <SlotContent parentStore={parentStore}/>
    : <SlotPlaceholder/>
}
Slot.displayName = 'Slot'

const slotFeatures = addOrUpdateFeatures({},
  {name: cfDisableMainComponentProperties, value: true},
  {name: cfDisableTooltipProperties, value: true},
  {name: cfDisableStyleProperties, value: true},
  {name: cfDisableAdditionalProperties, value: true},
)

/**
 * Form viewer slot metadata. **Internal use only.**
 */
export const slotModel = new Model(Slot, 'Slot', undefined, undefined, undefined,
  undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  undefined, undefined, undefined, slotFeatures)
