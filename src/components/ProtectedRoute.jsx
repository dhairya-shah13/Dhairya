import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loadingUser } = useAuth()

  if (loadingUser) {
    return <Spinner text="Checking session..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
