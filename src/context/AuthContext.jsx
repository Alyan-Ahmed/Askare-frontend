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
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('askare_user_name') || ''
  })
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('askare_user_email') || ''
  })
  const [userAvatar, setUserAvatar] = useState(() => {
    return localStorage.getItem('askare_user_avatar') || ''
  })
  const [userGender, setUserGender] = useState(() => {
    return localStorage.getItem('askare_user_gender') || ''
  })

  useEffect(() => {
    localStorage.setItem('askare_logged_in', isLoggedIn)
    if (!isLoggedIn) {
      localStorage.removeItem('askare_role')
      localStorage.removeItem('askare_user_name')
      localStorage.removeItem('askare_user_email')
      localStorage.removeItem('askare_user_avatar')
      localStorage.removeItem('askare_user_gender')
    }
  }, [isLoggedIn])

  const login = (role, account = {}) => {
    setIsLoggedIn(true)
    setUserRole(role)
    setUserName(account.name || '')
    setUserEmail(account.email || '')
    setUserAvatar(account.avatar || '')
    setUserGender(account.gender || '')
    localStorage.setItem('askare_logged_in', 'true')
    localStorage.setItem('askare_role', role)
    if (account.name) localStorage.setItem('askare_user_name', account.name)
    else localStorage.removeItem('askare_user_name')
    if (account.email) localStorage.setItem('askare_user_email', account.email)
    else localStorage.removeItem('askare_user_email')
    if (account.avatar) localStorage.setItem('askare_user_avatar', account.avatar)
    else localStorage.removeItem('askare_user_avatar')
    if (account.gender) localStorage.setItem('askare_user_gender', account.gender)
    else localStorage.removeItem('askare_user_gender')
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUserRole('')
    setUserName('')
    setUserEmail('')
    setUserAvatar('')
    setUserGender('')
    localStorage.removeItem('askare_logged_in')
    localStorage.removeItem('askare_role')
    localStorage.removeItem('askare_user_name')
    localStorage.removeItem('askare_user_email')
    localStorage.removeItem('askare_user_avatar')
    localStorage.removeItem('askare_user_gender')
  }

  // Expose a `user` object for convenience (null when not logged in)
  const user = isLoggedIn ? { role: userRole, name: userName, email: userEmail, avatar: userAvatar, gender: userGender } : null

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
