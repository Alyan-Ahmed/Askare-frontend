import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth({ role }) {
  const { isLoggedIn, userRole } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location }} />

  if (role && userRole !== role) {
    const fallback = userRole === 'doctor' ? '/doctor-dashboard' : userRole === 'patient' ? '/patient-dashboard' : userRole === 'admin' ? '/admin-dashboard' : '/login'
    return <Navigate to={fallback} replace />
  }

  return <Outlet />
}
