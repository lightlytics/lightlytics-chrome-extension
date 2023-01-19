import { useCallback, useState, useEffect } from 'react'
import {
  addStorageListener,
  clearStorageValue,
  getStorageValue,
  setStorageValue,
} from '../storage'

function useStorage<T>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<T | undefined>(defaultValue)

  useEffect(() => {
    getStorageValue(key).then(value => {
      if (typeof value !== 'undefined') {
        setValue(value as T)
      }
    })
  }, [key])

  useEffect(() => {
    return addStorageListener(key, setValue)
  }, [key])

  const setter = useCallback(
    (newValue, { merge } = { merge: false }) => {
      return setStorageValue(key, merge ? { ...value, ...newValue } : newValue)
    },
    [key, value],
  )

  const remover = useCallback(() => {
    return clearStorageValue(key)
  }, [key])

  return [value, setter, remover] as const
}

export default useStorage
