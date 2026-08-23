import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  clearAuthSession,
  getCurrentUser,
  getStoredUser,
  getToken,
  loginUser as loginUserApi,
  setAuthSession,
  setUnauthorizedHandler,
} from '../api'
import { useToast } from '../components/Toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken())
  const [user, setUser] = useState(() => getStoredUser())
  const [loadingUser, setLoadingUser] = useState(() => Boolean(getToken()))
  const navigate = useNavigate()
  const showToast = useToast()

  const logout = useCallback(() => {
    clearAuthSession()
    setToken(null)
    setUser(null)
    navigate('/login')
  }, [navigate])

  const login = useCallback(async (email, password) => {
    const data = await loginUserApi({ email, password })
    setAuthSession(data.token, data.user)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  useEffect(() => {
    setUnauthorizedHandler((message) => {
      setToken(null)
      setUser(null)
      showToast(message || 'Session expired. Please log in again.', 'error')
      navigate('/login')
    })

    return () => setUnauthorizedHandler(null)
  }, [navigate, showToast])

  useEffect(() => {
    if (!token) {
      setLoadingUser(false)
      return
    }

    let cancelled = false
    setLoadingUser(true)

    getCurrentUser()
      .then((data) => {
        if (cancelled) return
        setUser(data.user)
        setAuthSession(token, data.user)
      })
      .catch(() => {
        // 401 handling in api.js already clears the session and redirects
      })
      .finally(() => {
        if (!cancelled) setLoadingUser(false)
      })

    return () => {
      cancelled = true
    }
  }, [token])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      loadingUser,
      login,
      logout,
    }),
    [token, user, loadingUser, login, logout]
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
