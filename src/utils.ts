export function getStorageData<Type>(key: string): Promise<Type> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => {
      resolve(result[key]);
    });
  });
}
export function setStorageData<Type>(key: string, value: Type): Promise<void> {
  return chrome.storage.sync.set({ [key]: value });
}
