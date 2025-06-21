// Optional improved ProtectedRoute.jsx
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  const {user,loaded} = useSelector((state) => state.auth)
  const token = localStorage.getItem("lafuser_token")
console.log("ProtectedRoute user:", user)
    console.log("ProtectedRoute token:", token)
    if (!loaded) return <div>Loading...</div>
  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
