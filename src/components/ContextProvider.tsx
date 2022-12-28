import { ApolloProvider, InMemoryCache } from '@apollo/client'
import { createTheme, ThemeProvider, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import context, { ContextProps, dispatcher } from '../context'
import { getAWSAccounts } from '../hooks/useAWSAccounts'
import useClient from '../hooks/useClient'

const theme = createTheme({
  typography: {
    subtitle1: {
      fontSize: 14,
      lineHeight: 'unset',
    },
    subtitle2: {
      fontSize: 13,
      lineHeight: 'unset',
    },
    body1: { fontSize: 12 },
    body2: { fontSize: 12 },
    caption: { fontSize: 11 },
  },
})

const ContextProvider: React.FC<any> = ({ cache, awsAccountId, children }) => {
  const client = useClient({ cache })
  const [error, setError] = useState<Error>()
  const [value, setValue] = useState<ContextProps>({})

  useEffect(() => {
    if (client && awsAccountId) {
      setHeaders()
    }
    async function setHeaders() {
      const { map } = await getAWSAccounts(client)
      const customer = map[awsAccountId]
      if (customer) {
        setValue({
          headers: {
            customer,
          },
        })
      } else {
        setError(new Error(`Account ID "${awsAccountId}" not found`))
      }
    }
  }, [awsAccountId, client])

  if (error) {
    return <Typography>{error.message}</Typography>
  }

  if (awsAccountId && !value?.headers?.customer) {
    return <Typography>Loading</Typography>
  }

  return (
    <context.Provider value={value}>
      <dispatcher.Provider value={setValue}>
        <ThemeProvider theme={theme}>
          <APIProvider cache={cache}>{children}</APIProvider>
        </ThemeProvider>
      </dispatcher.Provider>
    </context.Provider>
  )
}

export const APIProvider: React.FC<any> = ({ cache, children }) => {
  cache = useMemo(() => cache || new InMemoryCache(), [cache])

  const client = useClient({
    cache,
  })

  return client ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : (
    <React.Fragment />
  )
}

export default ContextProvider
