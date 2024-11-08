import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import {FormBuilderExample} from './components/FormBuilderExample'
import {FormViewerExample} from './components/FormViewerExample'
import {Main} from './components/Main'
import {ErrorPage} from './ErrorPage'
import './index.css'
import reportWebVitals from './reportWebVitals'
import {Root} from './routes/root'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: '',
        element: <Main/>,
      },
      {
        path: 'form-builder',
        element: <FormBuilderExample/>,
      },
      {
        path: 'form-viewer',
        element: <FormViewerExample/>,
      },
    ],
  },
])

root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
