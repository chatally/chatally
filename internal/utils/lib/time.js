export function getCurrentTime() {
  const iso = new Date().toISOString()
  return iso.split('T')[1].slice(0, -1)
}
