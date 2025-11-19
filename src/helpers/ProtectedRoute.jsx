import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { Loader } from "lucide-react"
import { motion } from "framer-motion"

const ProtectedRoute = ({ children }) => {
  const { user, loaded } = useSelector((state) => state.auth)
  const token = localStorage.getItem("lafuser_token")

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-cyan-500 dark:text-cyan-400"
        >
          <Loader className="w-8 h-8" />
        </motion.div>
      </div>
    )
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
