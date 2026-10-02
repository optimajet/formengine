import type {BuilderComponent} from '@react-form-builder/core'
import {mantineComponentDefiners} from './mantineComponentDefiners'

export const builderComponents: BuilderComponent[] = mantineComponentDefiners.map(def => def.build())
