import {mantineComponentDefiners} from './mantineComponentDefiners'

export const builderComponents = mantineComponentDefiners.map(def => def.build())
