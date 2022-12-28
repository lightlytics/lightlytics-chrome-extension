import { useCallback, useEffect, useState } from 'react'

function useStorage<Type>(
  key: string,
  defaultValue?: Type,
): [Type | undefined, (newValue: any) => void, { loading: Boolean }] {
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState<Type | undefined>()
  useEffect(() => {
    setLoading(true)
    if (typeof chrome.storage === 'undefined') {
      setValue({
        ...defaultValue,
        ...JSON.parse(localStorage.getItem(key) || '{}'),
      })
    } else {
      chrome.storage.sync.get([key], function (result) {
        setValue({ ...defaultValue, ...result[key] })
        setLoading(false)
      })
    }
  }, [defaultValue, key])

  const handleChanges = useCallback(
    changes => {
      if (changes[key]) {
        setValue(changes[key].newValue)
      }
    },
    [key],
  )

  useEffect(() => {
    if (typeof chrome.storage === 'undefined') {
    } else {
      chrome.storage.onChanged.addListener(handleChanges)
      return () => chrome.storage.onChanged.removeListener(handleChanges)
    }
  }, [handleChanges])

  return [
    value,
    useCallback(
      (newValue: Type) => {
        if (typeof chrome.storage === 'undefined') {
          setValue(newValue)
          localStorage.setItem(key, JSON.stringify(newValue))
        } else {
          chrome.storage.sync.set({ [key]: newValue })
        }
      },
      [key],
    ),
    { loading },
  ]
}

export default useStorage
