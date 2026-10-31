import { useEffect, useState } from 'react'
import { api, type AuthUser } from '../services/api'

const TOKEN_KEY = 'opportunityhub-access-token'

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)
    void api.currentUser(token)
      .then((currentUser) => {
        if (active) setUser(currentUser)
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        if (active) {
          setToken(null)
          setUser(null)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [token])

  async function login(email: string, password: string) {
    const result = await api.login(email, password)
    localStorage.setItem(TOKEN_KEY, result.access_token)
    setToken(result.access_token)
    setUser(result.user)
    return result.user
  }

  async function register(fullName: string, email: string, password: string) {
    await api.register(fullName, email, password)
    return login(email, password)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  return { token, user, loading, login, register, logout }
}