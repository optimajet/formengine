import type {ContainerProps} from '@mantine/core'
import {Container} from '@mantine/core'
import {boolean, containerStyles, define, forwardRef, node, oneOf} from '@react-form-builder/core'
import {layoutCategory} from './internal/categories'
import {size} from './internal/sharedProps'

/**
 * Mantine container component for React Form Builder.
 * Forwards ref so the designer DnD can attach a ref (React 18 requires forwardRef for function components).
 * @param props component properties.
 * @returns container component.
 */
export const MtContainer = forwardRef<HTMLDivElement, ContainerProps>((props, ref) => (
  <Container display="flex" {...props} ref={ref}/>
))
MtContainer.displayName = 'MtContainer'

export const mtContainer = define(MtContainer, 'MtContainer')
  .category(layoutCategory)
  .kind('container')
  .props({
    children: node,
    fluid: boolean.default(false),
    size: size.default('md'),
    strategy: oneOf('block', 'grid').default('grid'),
  })
  .css({
    ...containerStyles,
    flexDirection: containerStyles.flexDirection.default('column'),
    gap: containerStyles.gap.default('10px'),
  })
