export function getStorageData<Type>(key: string): Promise<Type> {
  if (typeof chrome.storage === 'undefined') {
    const item = localStorage.getItem(key)
    return Promise.resolve(typeof item === 'string' ? JSON.parse(item) : item)
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
