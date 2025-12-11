import './wdyr'

import React from 'react'
import ReactDOM from 'react-dom'
import {ExampleViewerApp} from './ExampleViewerApp'

// eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  // @ts-ignore emotion mismatch with react types
  <React.StrictMode>
    <ExampleViewerApp />
  </React.StrictMode>,
  document.getElementById('root')
)
