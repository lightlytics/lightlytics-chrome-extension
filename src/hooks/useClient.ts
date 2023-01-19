import { useCallback, useMemo } from 'react'
import { createClient, ClientOptions } from '../client'
import useClientOptions from './useClientOptions'
import useSession from './useSession'

function useClient(options: ClientOptions | undefined) {
  const [clientOptions] = useClientOptions()
  const [session, updateSession] = useSession()

  const onRefresh = useCallback(
    (newAccessToken: string) => {
      updateSession(
        {
          access_token: newAccessToken,
        },
        {
          merge: true,
        },
      )
    },
    [updateSession],
  )

  return useMemo(
    () => createClient({ ...clientOptions, ...options, session, onRefresh }),
    [onRefresh, options, session, clientOptions],
  )
}

export default useClient
