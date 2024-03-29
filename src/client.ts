import {
  ApolloClient,
  createHttpLink,
  fromPromise,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { GraphQLErrors } from '@apollo/client/errors'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import {
  CLIENT_OPTIONS_STORAGE_KEY,
  LIGHTLYTICS_DEFAULT_HOST,
  SESSION_STORAGE_KEY,
} from './config'
import { getStorageValue, setStorageValue } from './storage'

type RefreshHandler = (newAccessToken: string) => void

export type ClientOptions = {
  host?: string
  customer?: string
  session?: Session
  onRefresh?: RefreshHandler
}

export type Session = {
  access_token: string
  refresh_token: string
  user: User
}

export type User = {
  _id: string
  full_name: string
}

export async function getClientOptions() {
  const clientOptions = await getStorageValue(CLIENT_OPTIONS_STORAGE_KEY)
  const session = await getStorageValue(SESSION_STORAGE_KEY)

  return {
    ...clientOptions,
    session,
    onRefresh(newAccessToken: string) {
      setStorageValue(SESSION_STORAGE_KEY, {
        ...session,
        access_token: newAccessToken,
      })
    },
  }
}

export async function getClient(defaultOptions?: ClientOptions) {
  const options = await getClientOptions()

  return createClient({ ...defaultOptions, ...options })
}

export type Client = ApolloClient<NormalizedCacheObject>

export function createClient(options: ClientOptions = {}): Client {
  const { host, session } = options
  const httpLink = getHttpLink(host)

  const authContext = {
    accessToken: options.session?.access_token,
    customer: options.customer,
  }
  function handleRefresh(newAccessToken: string) {
    authContext.accessToken = newAccessToken
    options.onRefresh?.(newAccessToken)
  }

  let link = httpLink

  if (session?.access_token) {
    link = getAuthLink(authContext).concat(link)
  }

  if (session?.refresh_token) {
    link = getErrorLink(session.refresh_token, handleRefresh, options).concat(
      link,
    )
  }

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  })
}

type AuthContext = {
  accessToken?: string
  customer?: string
}

export function getAuthLink(authContext: AuthContext) {
  return setContext(async (_, { headers }) => {
    return {
      headers: {
        ...(authContext.accessToken && {
          authorization: `Bearer ${authContext.accessToken}`,
        }),
        ...(authContext.customer && { customer: authContext.customer }),
        ...headers,
      },
    }
  })
}

export function getErrorLink(
  refreshToken: string,
  onRefresh?: RefreshHandler,
  options?: ClientOptions,
) {
  const ref = {
    current: {
      working: false,
      resolvers: [],
    },
  }
  return onError(({ networkError, graphQLErrors, operation, forward }) => {
    if (isAuthError(graphQLErrors)) {
      let forward$

      if (!ref.current.working) {
        ref.current.working = true

        forward$ = fromPromise(
          refreshSession(refreshToken, options)
            .then((newAccessToken: string) => {
              onRefresh?.(newAccessToken)
              ref.current.resolvers.forEach((resolve: any) => resolve())
              ref.current.resolvers = []
            })
            .finally(() => {
              ref.current.working = false
            }),
        )
      } else {
        forward$ = fromPromise(
          new Promise(resolve => {
            ref.current.resolvers.push(resolve as never)
          }),
        )
      }

      return forward$.flatMap(() => forward(operation))
    }

    if (networkError) {
      throw networkError
    }
  })
}

export async function refreshSession(
  refreshToken: string,
  options?: ClientOptions,
) {
  const client = createClient({
    host: options?.host,
  })

  const response = await client.mutate({
    mutation: gql`
      mutation ($refreshToken: String) {
        refresh(request: { refresh_token: $refreshToken }) {
          access_token
        }
      }
    `,
    variables: {
      refreshToken,
    },
  })

  return response.data?.refresh?.access_token
}

export function getHttpLink(host?: string) {
  return createHttpLink({
    uri: `https://${host || LIGHTLYTICS_DEFAULT_HOST}/graphql`,
  })
}

function isAuthError(graphQLErrors: GraphQLErrors | undefined) {
  return graphQLErrors?.find(({ extensions: { code } }) => {
    return code === 'UNAUTHENTICATED'
  })
}
