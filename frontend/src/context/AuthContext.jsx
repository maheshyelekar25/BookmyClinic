import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const userIdFromToken = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return Number(JSON.parse(atob(payload)).sub) || null
  } catch {
    return null
  }
}

const readStoredUser = () => {
  const value = localStorage.getItem('auth_user')
  const user = value ? JSON.parse(value) : null
  return user ? { ...user, id: user.id ?? userIdFromToken(localStorage.getItem('access_token') ?? '') } : null
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'))
  const [user, setUser] = useState(readStoredUser)

  const saveSession = (tokens, userData) => {
    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)
    const sessionUser = { ...userData, id: userData.id ?? userIdFromToken(tokens.access_token) }
    localStorage.setItem('auth_user', JSON.stringify(sessionUser))
    setToken(tokens.access_token)
    setUser(sessionUser)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
  }

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
