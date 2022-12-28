import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { getSettings } from './hooks/useSettings'
import { getUri } from './hooks/useUri'
import { getStorageData, setStorageData } from './utils'

const AUTH_STORE_KEY = 'auth'

export function setAccessToken(token: string) {
  return setStorageData(AUTH_STORE_KEY, token)
}

export function getAccessToken() {
  return getStorageData(AUTH_STORE_KEY).then(accessKey => {
    return accessKey || createAccessToken()
  })
}

export async function createAccessToken() {
  const settings = await getSettings()

  if (!settings?.username || !settings?.password) {
    throw new Error('Missing credentials')
  }

  const client = new ApolloClient({
    uri: await getUri(),
    cache: new InMemoryCache(),
  })

  return client
    .mutate({
      mutation: gql`
        mutation ($creds: Credentials) {
          login(credentials: $creds) {
            access_token
          }
        }
      `,
      variables: {
        creds: {
          email: settings?.username,
          password: settings?.password,
        },
      },
    })
    .then(({ data }) => {
      console.log(data)
      return data?.login?.access_token
    })
}
