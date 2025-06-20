"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setMode } from "../features/auth/authSlice"
import Navbar from "../components/Navbar"


const userPage = () => {
  const [mounted, setMounted] = useState(false)
  const dispatch = useDispatch()
  const mode = useSelector((state) => state.auth.mode)

  useEffect(() => {
    
  }, [])

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      <Navbar />
      this is a user area page
    </div>
  )
}

export default userPage
