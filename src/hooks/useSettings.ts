import { ISettings } from '../types'
import { getStorageData } from '../utils'
import useStorage from './useStorage'

const DEFAULT_SETTINGS: ISettings = {
  hostname: 'app.lightlytics.com',
  secured: true,
  username: '',
  password: '',
}

function useSettings() {
  return useStorage<ISettings>('settings', DEFAULT_SETTINGS)
}

export function getSettings() {
  return getStorageData<ISettings>('settings')
}

export default useSettings
