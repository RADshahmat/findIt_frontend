"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setMode } from "../features/auth/authSlice"
import SignInPage from "./SignInPage"
import SignUpPage from "./SignUpPage"
import Navbar from "../components/Navbar"

const LoginPage = () => {
  const [mounted, setMounted] = useState(false)
  const dispatch = useDispatch()
  const {mode,loaded} = useSelector((state) => state.auth)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMode = () => {
    dispatch(setMode(mode === "signin" ? "signup" : "signin"))
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Shared Layout / Branding */}
      <Navbar />
      {!loaded?<p>Loading</p>:
      <div className="w-full max-w-md space-y-4 mt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
            FindIt
          </h1>
          <p className="text-gray-600">
            {mode === "signin" ? "Welcome back!" : "Join our community today"}
          </p>
        </div>

        {/* Render Form */}
        {mode === "signin" ? <SignInPage /> : <SignUpPage />}

        {/* Toggle Prompt */}
        <div className="text-center ">
          {mode === "signin" ? (
            <p>
              Don’t have an account?{" "}
              <span
                onClick={toggleMode}
                className="text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Sign up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span
                onClick={toggleMode}
                className="text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Sign in
              </span>
            </p>
          )}
        </div>
      </div>
}
    </div>
  )
}

export default LoginPage
