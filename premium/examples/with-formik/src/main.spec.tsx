import {render} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import App from './App'

describe('App', () => {
  it('renders correctly', () => {
    const {getByTestId} = render(<App/>)
    expect(getByTestId('fullname')).toBeTruthy()
  })
})
