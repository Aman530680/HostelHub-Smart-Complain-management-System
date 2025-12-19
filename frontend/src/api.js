const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000'
export async function api(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'API error')
  return data
}
