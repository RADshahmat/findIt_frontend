"use client"

import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { registerUser } from "../features/auth/authSlice"
import Cropper from "react-easy-crop"
import getCroppedImg from "../helpers/cropImage"
import { Button, Slider } from "@mui/material"
import { CircularProgress } from "@mui/material"

const SignUpPage = () => {
    const dispatch = useDispatch()
    const fileInputRef = useRef()
    const { loading, error, userAdded } = useSelector((state) => state.auth)

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        age: "",
        gender: "",
    })

    const [image, setImage] = useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImageBlob, setCroppedImageBlob] = useState(null)
    const [showCropper, setShowCropper] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setImage(reader.result)
                setShowCropper(true)
            }
            reader.readAsDataURL(file)
        }
    }

    const onCropComplete = (_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels)
    }

    const generateCroppedImage = async () => {
        try {
            const cropped = await getCroppedImg(image, croppedAreaPixels)
            setCroppedImageBlob(cropped)
            setShowCropper(false)
        } catch (e) {
            console.error("Crop failed", e)
        }
    }

    const handleSubmit = (e) => {
        setSuccessMsg("");
        e.preventDefault()
        const data = new FormData()
        Object.entries(formData).forEach(([key, val]) => data.append(key, val))
        if (croppedImageBlob) {
            data.append("user_image", croppedImageBlob, "user_profile.jpg")
        }
        dispatch(registerUser(data))
    }

    useEffect(() => {
        if (userAdded) {
            setSuccessMsg("✅ Account created successfully!")
            setFormData({
                username: "",
                email: "",
                password: "",
                phone: "",
                address: "",
                age: "",
                gender: "",
            })
            fileInputRef.current.value = null
            setImage(null)
            setCrop({ x: 0, y: 0 })
            setZoom(1)
            setCroppedAreaPixels(null)
            setCroppedImageBlob(null)
            setShowCropper(false)
        }
    }, [userAdded])
    const loadLoginForm = () => {
        dispatch(setMode("signin"));
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
                <h2 className="text-3xl font-bold text-center text-cyan-600">Create an Account</h2>

                {showCropper && (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-200">
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                        <div className="mt-2">
                            <Slider min={1} max={3} step={0.1} value={zoom} onChange={(e, z) => setZoom(z)} />
                            <Button onClick={generateCroppedImage}>Crop</Button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className="input" />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="input" />
                    <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="input" />
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required className="input" />
                    <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" required className="input" />
                    <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Age" required className="input" />
                    <select name="gender" value={formData.gender} onChange={handleChange} required className="input">
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>


                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="w-full text-sm"
                    />

                    {croppedImageBlob && (
                        <img
                            src={URL.createObjectURL(croppedImageBlob)}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-full mx-auto"
                        />
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={20} color="inherit" />
                                Processing...
                            </>
                        ) : (
                            "Register"
                        )}
                    </button>
                </form>
                {error && <p className="text-red-600 text-sm text-center">{error.error || "Failed to create user."}</p>}
                {successMsg && (
                    <p className="text-green-600 text-sm text-center">
                        {successMsg}
                        <span
                            onClick={loadLoginForm}
                            className="text-cyan-600 underline cursor-pointer font-medium ml-2"
                        >
                            Log In
                        </span>
                    </p>
                )}


            </div>

            <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          outline: none;
          background: #f9fafb;
          transition: all 0.2s;
        }
        .input:focus {
          border-color: #22d3ee;
          background: white;
        }
      `}</style>
        </div>
    )
}

export default SignUpPage
