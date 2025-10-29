import {configure} from 'mobx'
import {useEffect} from 'react'

/**
 * Disables the `enforceActions` check for `mobx`, so that the state can be changed from anywhere.
 */
export const useMobxConfig = () => {
  useEffect(() => {
    configure({enforceActions: 'never'})
  }, [])
}
