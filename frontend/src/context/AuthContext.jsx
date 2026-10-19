import { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, logoutUser } from '../api/auth'
import api from '../api/axiosInstance'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/me/')
      .then((res) => {
        if (res.data?.authenticated) setUser({ username: res.data.username })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function login(username, password) {
    const data = await loginUser(username, password)
    if (data.success) {
      localStorage.setItem('auth_token', data.token)
      setUser({ username: data.username })
      return { success: true }
    }
    return { success: false, error: data.error }
  }

  async function logout() {
    try { await logoutUser() } catch (_) {}
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
