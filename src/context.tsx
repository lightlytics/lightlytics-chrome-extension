import { ApolloProvider } from '@apollo/client'
import { createTheme, ThemeProvider } from '@mui/material'
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext as useReactContext,
  useState,
} from 'react'
import { Client } from './client'

const context = createContext<ContextProps>({})
export const dispatcher = createContext<ContextDispatcher>(v => v)

export type ContextProps = {}

export type ContextDispatcher = Dispatch<SetStateAction<ContextProps>>

export function useContext() {
  return useReactContext<ContextProps>(context)
}

export function useDispatcher() {
  return useReactContext<ContextDispatcher>(dispatcher)
}

const theme = createTheme()

export const ContextProvider: React.FC<{
  client: Client
}> = ({ client, children }) => {
  const [value, setValue] = useState<ContextProps>({})

  return (
    <context.Provider value={value}>
      <dispatcher.Provider value={setValue}>
        <ThemeProvider theme={theme}>
          <ApolloProvider client={client}>{children}</ApolloProvider>
        </ThemeProvider>
      </dispatcher.Provider>
    </context.Provider>
  )
}

export default context
