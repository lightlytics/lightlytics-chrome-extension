import { useCallback, useMemo } from 'react'
import { createClient, ClientOptions } from '../client'
import useSession from './useSession'

function useClient(options: ClientOptions | undefined) {
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
    () => createClient({ ...options, session, onRefresh }),
    [onRefresh, options, session],
  )
}

export default useClient
