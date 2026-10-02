import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {provideRouter} from '@angular/router'

import {routes} from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}), provideRouter(routes), FormsModule],
}
