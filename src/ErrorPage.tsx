import {useRouteError} from 'react-router-dom'

export const ErrorPage = () => {
  const error: any = useRouteError()
  console.error(error)

  return (
    <div id="error-page">
      <h1>{error.statusText || error.message}</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  )
}
