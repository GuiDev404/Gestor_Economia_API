export function getStorage(key: string) {
  const storaged = window.localStorage.getItem(key)
  if(storaged) return JSON.parse(storaged)

  return window.localStorage.getItem(key)
}

export function setStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const KEY_STORAGE = 'auth'
