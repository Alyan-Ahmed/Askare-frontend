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
  const [userUid, setUserUid] = useState(() => {
    return localStorage.getItem('askare_user_uid') || ''
  })

  useEffect(() => {
    localStorage.setItem('askare_logged_in', isLoggedIn)
    if (!isLoggedIn) {
      localStorage.removeItem('askare_role')
      localStorage.removeItem('askare_user_name')
      localStorage.removeItem('askare_user_email')
      localStorage.removeItem('askare_user_avatar')
      localStorage.removeItem('askare_user_gender')
      localStorage.removeItem('askare_user_uid')
    }
  }, [isLoggedIn])

  const login = (role, account = {}) => {
    setIsLoggedIn(true)
    setUserRole(role)
    setUserName(account.name || '')
    setUserEmail(account.email || '')
    setUserAvatar(account.avatar || '')
    setUserGender(account.gender || '')
    setUserUid(account.uid || '')
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
    if (account.uid) localStorage.setItem('askare_user_uid', account.uid)
    else localStorage.removeItem('askare_user_uid')
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUserRole('')
    setUserName('')
    setUserEmail('')
    setUserAvatar('')
    setUserGender('')
    setUserUid('')
    localStorage.removeItem('askare_logged_in')
    localStorage.removeItem('askare_role')
    localStorage.removeItem('askare_user_name')
    localStorage.removeItem('askare_user_email')
    localStorage.removeItem('askare_user_avatar')
    localStorage.removeItem('askare_user_gender')
    localStorage.removeItem('askare_user_uid')
  }

  const updateUser = (updates) => {
    if (updates.name !== undefined) { setUserName(updates.name); localStorage.setItem('askare_user_name', updates.name) }
    if (updates.email !== undefined) { setUserEmail(updates.email); localStorage.setItem('askare_user_email', updates.email) }
    if (updates.avatar !== undefined) { setUserAvatar(updates.avatar); localStorage.setItem('askare_user_avatar', updates.avatar) }
    if (updates.gender !== undefined) { setUserGender(updates.gender); localStorage.setItem('askare_user_gender', updates.gender) }
  }

  const deleteAccount = () => {
    // Permanently remove user from sessionStorage so they can't log in again
    const currentEmail = userEmail
    const tempUsers = JSON.parse(sessionStorage.getItem('askare_temp_users') || '[]')
    const filtered = tempUsers.filter(u => u.email !== currentEmail)
    sessionStorage.setItem('askare_temp_users', JSON.stringify(filtered))
    logout()
  }

  const deactivateAccount = () => {
    // Mark account as deactivated but don't delete — they can log in again
    logout()
  }

  // Expose a `user` object for convenience (null when not logged in)
  const user = isLoggedIn ? { role: userRole, name: userName, email: userEmail, avatar: userAvatar, gender: userGender, uid: userUid } : null

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, user, login, logout, updateUser, deleteAccount, deactivateAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
