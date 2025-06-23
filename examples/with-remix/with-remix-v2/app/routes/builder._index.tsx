import {lazy, useEffect, useState} from 'react'

const BuilderClient = lazy(() => import('~/components/builder.client.js'))

export default function Builder_index() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <BuilderClient/> : null
}
