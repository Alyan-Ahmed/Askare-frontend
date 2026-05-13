/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('askare_logged_in') === 'true'
  })
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('askare_role') || ''
  })

  useEffect(() => {
    localStorage.setItem('askare_logged_in', isLoggedIn)
    if (!isLoggedIn) {
      localStorage.removeItem('askare_role')
    }
  }, [isLoggedIn])

  const login = (role) => {
    setIsLoggedIn(true)
    setUserRole(role)
    localStorage.setItem('askare_logged_in', 'true')
    localStorage.setItem('askare_role', role)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUserRole('')
    localStorage.removeItem('askare_logged_in')
    localStorage.removeItem('askare_role')
  }

  // Expose a `user` object for convenience (null when not logged in)
  const user = isLoggedIn ? { role: userRole } : null

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
