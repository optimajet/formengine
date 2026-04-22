import cx from 'clsx'
import type {ComponentType, ReactNode} from 'react'
import {useEffect, useRef} from 'react'
import {useStore} from '../../utils/contexts/StoreContext'
import {namedObserver} from '../../utils/namedObserver'
import type {FormViewerWrapperComponentProps} from '../define/utils/FormViewerWrapperComponentProps'
import type {CssCleanupFunction} from '../define/utils/IView'
import {AsyncQueue} from './AsyncQueue'
import type {Language} from './language'
import styles from './ViewerLocalizationProvider.module.css'

interface ViewerLocalizationProviderProps {
  children: ReactNode
}

const viewerClassName = 'optimajet-formviewer'

const viewerClass = cx(viewerClassName, styles.localizationProvider)

const nestViewerWrappers = ([Wrapper, ...more]: ComponentType<FormViewerWrapperComponentProps>[],
                            language: Language, children: ReactNode) => {
  return Wrapper
    ? <Wrapper language={language}>{nestViewerWrappers(more, language, children)}</Wrapper>
    : children
}

const cssQueue = new AsyncQueue()

const RawViewerLocalizationProvider = (props: ViewerLocalizationProviderProps) => {
  const viewerStore = useStore()
  const language = viewerStore.displayedLanguage
  const bidi = language.bidi
  const cleanupRef = useRef<CssCleanupFunction[]>([])
  const {view} = viewerStore.formViewerPropsStore

  useEffect(() => {
    const loaders = view.getCssLoaders(bidi)
    loaders.forEach(loader => {
      cssQueue.add(async () => {
        const result = await loader()
        if (typeof result === 'function') {
          cleanupRef.current.push(result)
        }
      }).catch(console.error)
    })

    // Cleanup on unmount or bidi change
    return () => {
      const cleanupsToRun = cleanupRef.current
      cleanupRef.current = []
      cleanupsToRun.forEach(unloader => {
        cssQueue.add(async () => {
          await unloader()
        }).catch(console.error)
      })
    }
  }, [bidi, view])

  const viewer = <div dir={bidi} lang={language.fullCode} className={viewerClass}>
    {props.children}
  </div>

  return nestViewerWrappers(view.viewerWrappers, language, viewer)
}

export const ViewerLocalizationProvider = namedObserver('ViewerLocalizationProvider', RawViewerLocalizationProvider)
