import {Dropdown} from 'rsuite'
import {version} from '../utils/config.json'
import {info} from '../images/icons'

/**
 * Displays the application version.
 * @returns The version text.
 */
export const Version = () => {
  return (
    <Dropdown.Item icon={info} disabled={true}>
      {version}
    </Dropdown.Item>
  )
}
