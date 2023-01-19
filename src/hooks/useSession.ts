import { Session } from '../client'
import { SESSION_STORAGE_KEY } from '../config'
import useStorage from './useStorage'

function useSession() {
  return useStorage<Session>(SESSION_STORAGE_KEY)
}

export default useSession
