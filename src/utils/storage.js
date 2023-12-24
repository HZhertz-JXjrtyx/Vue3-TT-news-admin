export function getLocal(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

export function setLocal(key, value) {
  const data = JSON.stringify(value)
  return localStorage.setItem(key, data)
}

export function removeLocal(key) {
  return localStorage.removeItem(key)
}
