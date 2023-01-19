import { useMemo } from 'react'
import { ClientOptions, createClient } from '../client'

function useClient(options: ClientOptions | undefined) {
  return useMemo(() => createClient(options), [options])
}

export default useClient
