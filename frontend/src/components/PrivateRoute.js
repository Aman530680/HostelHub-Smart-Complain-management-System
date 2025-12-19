import React from 'react'
import { Navigate } from 'react-router-dom'
import { getAuth } from '../utils/auth'
export default function PrivateRoute({ children, role }) {
  const user = getAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}
