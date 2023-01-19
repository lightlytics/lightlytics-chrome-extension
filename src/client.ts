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
import { LIGHTLYTICS_HOST_URL } from './config'

type RefreshHandler = (newAccessToken: string) => void

export type ClientOptions = {
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

export function createClient(
  options: ClientOptions = {},
): ApolloClient<NormalizedCacheObject> {
  const httpLink = getHttpLink()
  const { session } = options

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
    link = getErrorLink(session.refresh_token, handleRefresh).concat(link)
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

export function getErrorLink(refreshToken: string, onRefresh?: RefreshHandler) {
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
          refreshSession(refreshToken)
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

export async function refreshSession(refreshToken: string) {
  const client = createClient()

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

export function getHttpLink() {
  return createHttpLink({
    uri: `${LIGHTLYTICS_HOST_URL}/graphql`,
  })
}

function isAuthError(graphQLErrors: GraphQLErrors | undefined) {
  return graphQLErrors?.find(({ extensions: { code } }) => {
    return code === 'UNAUTHENTICATED'
  })
}