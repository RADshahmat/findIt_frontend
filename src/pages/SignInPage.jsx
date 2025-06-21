"use client"

import { useDispatch, useSelector } from "react-redux"
import { updateForm, setLoading, loginUser } from "../features/auth/authSlice"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"

const SignInPage = () => {
  const dispatch = useDispatch()
  const { formData, isLoading, error,user,loaded } = useSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)

   const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate("/user")
    }
  }, [user, navigate])


  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch(updateForm({ [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setLoading(true))
    dispatch(loginUser({ email: formData.email, password: formData.password }))
  }

  return (<>
  
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-gray-400" />
        </div>
        <input
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={handleChange}
          placeholder="Email Address"
          required
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
        />
      </div>

      {/* Password input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password || ""}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 inset-y-0"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-cyan-500 text-white py-3 rounded-xl flex justify-center items-center gap-2"
      >
        {isLoading ? "Signing In..." : "Sign In"}
        <ArrowRight className="inline h-4 w-4" />
      </button>
      {error && <p className="text-red-600 text-sm text-center">{error.error || "Login failed.Check email or password"}</p>}
    </form>

    </>
  )
}

export default SignInPage
