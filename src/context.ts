import {
  useContext as useReactContext,
  createContext,
  SetStateAction,
  Dispatch,
} from 'react'

const context = createContext<ContextProps>({})
export const dispatcher = createContext<ContextDispatcher>(v => v)

export type ContextProps = {
  headers?: any
}

export type ContextDispatcher = Dispatch<SetStateAction<ContextProps>>

export function useContext() {
  return useReactContext<ContextProps>(context)
}

export function useDispatcher() {
  return useReactContext<ContextDispatcher>(dispatcher)
}

export default context
