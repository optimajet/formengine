import './wdyr'

import React from 'react'
// eslint-disable-next-line import/extensions
import {createRoot} from 'react-dom/client'
import {ExampleViewerApp} from './ExampleViewerApp'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <ExampleViewerApp />
  </React.StrictMode>
)
