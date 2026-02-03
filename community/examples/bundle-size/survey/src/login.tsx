import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Model} from 'survey-core'
import {Survey} from 'survey-react-ui'
import 'survey-core/survey-core.min.css'
import {json} from './login-json.tsx'
import {themeJson} from './theme'

import '@react-form-builder/bundle-size-shared/index.css'

function SurveyComponent() {
  const survey = new Model(json)
  survey.applyTheme(themeJson)
  survey.onComplete.add(sender => {
    console.warn(JSON.stringify(sender.data, null, 3))
  })
  return <Survey model={survey} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SurveyComponent />
  </StrictMode>
)
