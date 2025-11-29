import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { getToken as getStoredToken } from '../../utils/storage'

const RequireAuth: React.FC = () => {
  const reduxToken = useAppSelector((state) => state.user.token)
  const token = reduxToken || getStoredToken()
  const location = useLocation()

  if (!token) {
    const target = `${location.pathname}${location.search || ''}`
    return <Navigate to="/login" state={{ from: target }} replace />
  }

  return <Outlet />
}

export default RequireAuth
