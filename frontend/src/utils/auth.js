export function setAuth(user) {
  localStorage.setItem('hh_user', JSON.stringify(user))
}
export function getAuth() {
  const s = localStorage.getItem('hh_user')
  return s ? JSON.parse(s) : null
}
export function logout() {
  localStorage.removeItem('hh_user')
}
