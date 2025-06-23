import styled from '@emotion/styled'
import {Steps} from 'rsuite'

export const SItem = styled(Steps.Item)`
  z-index: 7;

  &.rs-steps-item-status-process:not(.active) .rs-steps-item-icon-wrapper {
    color: var(--rs-text-secondary);
    background-color: initial;
  }

  &.available {
    cursor: pointer;

    &:hover {
      color: var(--rs-steps-state-finish);

      .rs-steps-item-icon-wrapper {
        border: 2px solid var(--rs-steps-state-finish);
      }
    }
  }

  &.active:hover .rs-steps-item-icon-wrapper {
    opacity: 0.8;
  }
`
