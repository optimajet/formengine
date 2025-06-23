import {lazy, useEffect, useState} from 'react'

const ViewerClient = lazy(() => import('~/components/viewer.client.js'))

export default function Viewer_index() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <ViewerClient/> : null
}
