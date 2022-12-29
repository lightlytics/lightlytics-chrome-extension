import {
  ApolloClient,
  createHttpLink,
  fromPromise,
  InMemoryCache,
} from '@apollo/client'
import { GraphQLErrors } from '@apollo/client/errors'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { useMemo, useRef } from 'react'
import { createAccessToken, getAccessToken, setAccessToken } from '../auth'
import { useContext } from '../context'
import useUri from './useUri'

function useClient({ cache }: { cache: InMemoryCache }) {
  const httpLink = useHttpLink()
  const authLink = useAuthLink()
  const errorLink = useErrorLink()

  return useMemo(
    () =>
      httpLink &&
      new ApolloClient({
        link: errorLink.concat(authLink.concat(httpLink)),
        cache: cache || new InMemoryCache(),
      }),
    [httpLink, errorLink, authLink, cache],
  )
}

function useHttpLink() {
  const uri = useUri()
  return useMemo(() => getHttpLink(uri), [uri])
}

export function getHttpLink(uri: any) {
  return (
    uri &&
    createHttpLink({
      uri,
    })
  )
}

export function getAuthLink(context?: any) {
  return setContext(async (_, { headers }) => {
    return {
      ...context,
      headers: {
        ...context?.headers,
        authorization: `Bearer ${await getAccessToken()}`,
        ...headers,
      },
    }
  })
}

export function useAuthLink() {
  const context = useContext()
  return useMemo(() => getAuthLink(context), [context])
}

export function getErrorLink(ref: any) {
  return onError(({ networkError, graphQLErrors, operation, forward }) => {
    if (isAuthError(graphQLErrors)) {
      let forward$

      if (!ref.current.working) {
        ref.current.working = true

        forward$ = fromPromise(
          createAccessToken()
            .then(token => {
              setAccessToken(token)
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

function useErrorLink() {
  const ref = useRef({
    working: false,
    resolvers: [] as (() => void)[],
  })

  return useMemo(() => getErrorLink(ref), [])
}

function isAuthError(graphQLErrors: GraphQLErrors | undefined) {
  return graphQLErrors?.find(({ extensions: { code } }) => {
    return code === 'UNAUTHENTICATED'
  })
}

export default useClient
