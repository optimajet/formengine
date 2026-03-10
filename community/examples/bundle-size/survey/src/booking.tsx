import {StrictMode, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {Model, SurveyModel} from 'survey-core'
import {Survey} from 'survey-react-ui'
import 'survey-core/survey-core.min.css'
import {json} from './booking-json.tsx'
import {themeJson} from './theme'

import '@react-form-builder/bundle-size-shared/index.css'

function SurveyComponent() {
  const [survey] = useState<SurveyModel>(() => {
    const model = new Model(json)
    model.applyTheme(themeJson)
    model.onComplete.add(sender => {
      console.warn(JSON.stringify(sender.data, null, 3))
    })
    return model
  })

  return <Survey model={survey} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SurveyComponent />
  </StrictMode>
)
