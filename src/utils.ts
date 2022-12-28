export function getStorageData<Type>(key: string): Promise<Type> {
  if (typeof chrome.storage === 'undefined') {
    return Promise.resolve(JSON.parse(localStorage.getItem(key) || '{}'))
  } else {
    return new Promise(resolve => {
      chrome.storage.sync.get(key, result => {
        resolve(result[key])
      })
    })
  }
}
export function setStorageData<Type>(key: string, value: Type): Promise<void> {
  if (typeof chrome.storage === 'undefined') {
    localStorage.setItem(key, JSON.stringify(value))
    return Promise.resolve()
  } else {
    return chrome.storage.sync.set({ [key]: value })
  }
}
