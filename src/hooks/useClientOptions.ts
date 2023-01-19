import { ClientOptions } from '../client'
import { CLIENT_OPTIONS_STORAGE_KEY, LIGHTLYTICS_DEFAULT_HOST } from '../config'
import useStorage from './useStorage'

function useClientOptions() {
  return useStorage<ClientOptions>(CLIENT_OPTIONS_STORAGE_KEY, {
    host: LIGHTLYTICS_DEFAULT_HOST,
  })
}

export default useClientOptions
