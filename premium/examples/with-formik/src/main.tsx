import {StrictMode} from 'react'
// eslint-disable-next-line import/extensions
import {createRoot} from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
