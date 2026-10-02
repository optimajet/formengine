import type {BuilderComponent} from '@react-form-builder/core'
import {rSuiteComponents} from './rSuiteComponents'

export const components: BuilderComponent[] = rSuiteComponents.map(def => def.build())
