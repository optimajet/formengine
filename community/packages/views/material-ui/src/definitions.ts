import type {BuilderComponent} from '@react-form-builder/core'
import {muiComponents} from './muiComponents'

export const components: BuilderComponent[] = muiComponents.map(def => def.build())
