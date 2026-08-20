import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const userIdFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()) return null
    return Number(payload.sub) || null
  } catch {
    return null
  }
}

const tokenExpiryMs = (token) => {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof exp === 'number' ? exp * 1000 : null
  } catch {
    return null
  }
}

const readStoredUser = () => {
  try {
    const token = localStorage.getItem('access_token') ?? ''
    const id = userIdFromToken(token)
    if (!id) return null
    const value = localStorage.getItem('auth_user')
    const user = value ? JSON.parse(value) : null
    return user ? { ...user, id: user.id ?? id } : { id }
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('access_token')
    return userIdFromToken(stored ?? '') ? stored : null
  })
  const [user, setUser] = useState(readStoredUser)

  const saveSession = (tokens, userData) => {
    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)
    const sessionUser = { ...userData, id: userData.id ?? userIdFromToken(tokens.access_token) }
    localStorage.setItem('auth_user', JSON.stringify(sessionUser))
    setToken(tokens.access_token)
    setUser(sessionUser)
  }

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    const expiresAt = tokenExpiryMs(token ?? '')
    if (!expiresAt) return undefined
    const timeout = window.setTimeout(logout, Math.max(0, expiresAt - Date.now()))
    return () => window.clearTimeout(timeout)
  }, [token, logout])

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login: saveSession, logout }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
