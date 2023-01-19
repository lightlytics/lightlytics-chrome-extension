export function getStorageValue(key: string) {
  return chrome.storage.local.get([key]).then(data => {
    return data[key]
  })
}

export function setStorageValue<T>(key: string, value: T) {
  return chrome.storage.local.set({ [key]: value })
}

export function clearStorageValue(key: string) {
  return chrome.storage.local.remove(key)
}

export function addStorageListener<T>(
  key: string,
  onChange: (newValue: T) => void,
) {
  chrome.storage.onChanged.addListener(changeHandler)

  return () => {
    chrome.storage.onChanged.removeListener(changeHandler)
  }

  function changeHandler(changes: {
    [key: string]: chrome.storage.StorageChange
  }) {
    for (let [k, { newValue }] of Object.entries(changes)) {
      if (k === key) {
        onChange(newValue)
      }
    }
  }
}
