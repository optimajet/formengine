import styled from '@emotion/styled'
import {Loader} from 'rsuite'

export const SLoader = styled(Loader)`
  && {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 0;
    background: var(--rs-bg-overlay);
    width: 100%;
    padding-block: 10px;
  }
`
