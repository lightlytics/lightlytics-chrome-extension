import { User } from '../client'
import { USER_STORAGE_KEY } from '../config'
import useStorage from './useStorage'

function useCurrentUser() {
  return useStorage<User>(USER_STORAGE_KEY)
}

export default useCurrentUser
