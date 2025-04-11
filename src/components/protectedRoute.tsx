import { Navigate, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '@/provider/appContext'

interface ProtectedRouteProps {
  allowedRoles: string[]
  redirectPath?: string
}

const ProtectedRoute = ({ allowedRoles, redirectPath = '/auth/login' }: ProtectedRouteProps) => {
  const accessToken = localStorage.getItem('accessToken')
  const { user } = useContext(AppContext)

  const parsedUser = user ? user : null

  if (!accessToken || !parsedUser) {
    return <Navigate to={redirectPath} replace />
  }

  const userRoles = parsedUser.role || []
  const hasPermission = allowedRoles.some((role) => userRoles.includes(role))

  return hasPermission ? <Outlet /> : <Navigate to='/unauthorized' replace />
}

export default ProtectedRoute
