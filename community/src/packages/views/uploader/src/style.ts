import {css} from '@emotion/css'

export const containerStyle = css`
  display: flex;
  cursor: pointer;
  user-select: none;

  &.dropzone {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border: 2px dashed #888f9b;
    border-radius: 4px;
    color: #bdbdbd;
    outline: none;
    transition: all 0.24s ease-in-out;
    cursor: pointer;
    min-height: 100px;

    &:hover {
      border-color: #2196f3;
    }

    &.isDragActive {
      border-color: #2196f3;
    }

    &.isDragAccept {
      border-color: #00e676;
    }

    &.isDragReject {
      border-color: #ff1744;
    }
  }
`
