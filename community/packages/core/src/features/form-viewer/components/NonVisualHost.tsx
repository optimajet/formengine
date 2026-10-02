import {useStore} from '../../../utils/contexts/StoreContext'
import {getNonVisualChildren} from '../../../utils/isNonVisual'
import {namedObserver} from '../../../utils/namedObserver'
import {ComponentTree} from '../../ui/ComponentTree'

const hiddenHostStyle = {display: 'none'} as const

/**
 * Mounts non-visual root children off-layout so their side effects still run.
 * @returns the React element, or null when there are no non-visual children.
 */
const RawNonVisualHost = () => {
  const store = useStore()
  const nonVisual = getNonVisualChildren(store.form.componentTree)

  if (!nonVisual.length) return null

  return (
    <div aria-hidden="true" data-testid="non-visual-host" style={hiddenHostStyle}>
      <ComponentTree data={nonVisual} />
    </div>
  )
}

export const NonVisualHost = namedObserver('NonVisualHost', RawNonVisualHost)
