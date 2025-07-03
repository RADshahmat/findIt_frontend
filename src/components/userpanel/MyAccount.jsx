import { updateUser } from "../../features/auth/authSlice"
import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { User, Camera, Upload, Save, Eye, EyeOff } from "lucide-react"
import Cropper from "react-easy-crop"
import getCroppedImg from "../../helpers/cropImage"
import { Button, Slider } from "@mui/material"
import { CircularProgress } from "@mui/material"

const MyAccount = () => {
  const dispatch = useDispatch()
  const fileInputRef = useRef()
  const { user, loading, error } = useSelector((state) => state.auth)

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
  const [showPassword, setShowPassword] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState(null)

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "", // Don't pre-fill password for security
        phone: user.phone || "",
        address: user.address || "",
        age: user.age || "",
        gender: user.gender || "",
      })
      setProfileImageUrl(user.user_image || null)
    }
  }, [user])

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
      setProfileImageUrl(URL.createObjectURL(cropped))
      setShowCropper(false)
    } catch (e) {
      console.error("Crop failed", e)
    }
  }
    
  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccessMsg("")

    const data = new FormData()

    // Only append fields that have values
    Object.entries(formData).forEach(([key, val]) => {
      if (val && val.trim() !== "") {
        data.append(key, val)
      }
    })

    // Append profile image if cropped
    if (croppedImageBlob) {
      data.append("user_image", croppedImageBlob, "user_profile.jpg")
    }

    dispatch(updateUser(data))
      .unwrap()
      .then(() => {
        setSuccessMsg("✅ Profile updated successfully!")
        setTimeout(() => setSuccessMsg(""), 3000)
      })
      .catch((err) => {
        console.error("Update failed:", err)
        setSuccessMsg("")
      })
  }

  const cancelCrop = () => {
    setShowCropper(false)
    setImage(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Account</h1>

        {/* Image Cropper Modal */}
        {showCropper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-center">Crop Your Profile Photo</h3>
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-200 mb-4">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Zoom</label>
                <Slider
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e, z) => setZoom(z)}
                  sx={{
                    color: "#06b6d4",
                    "& .MuiSlider-thumb": {
                      backgroundColor: "#06b6d4",
                    },
                    "& .MuiSlider-track": {
                      backgroundColor: "#06b6d4",
                    },
                  }}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={cancelCrop}
                  variant="outlined"
                  className="flex-1"
                  sx={{
                    borderColor: "#6b7280",
                    color: "#6b7280",
                    "&:hover": {
                      borderColor: "#4b5563",
                      backgroundColor: "#f9fafb",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={generateCroppedImage}
                  variant="contained"
                  className="flex-1"
                  sx={{
                    background: "linear-gradient(to right, #06b6d4, #14b8a6)",
                    "&:hover": {
                      background: "linear-gradient(to right, #0891b2, #0d9488)",
                    },
                  }}
                >
                  Crop & Save
                </Button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Profile Photo</h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="text-gray-600 mb-3 text-sm">Upload a profile photo to help others recognize you</p>
                <label className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all cursor-pointer text-sm font-medium">
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 1234 567890"
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  min="13"
                  max="120"
                  required
                  className="input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required className="input">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password (Optional)</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <CircularProgress size={16} color="inherit" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Success/Error Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error.error || "Failed to update profile."}</p>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{successMsg}</p>
            </div>
          )}
        </form>
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
          font-size: 0.875rem;
        }
        .input:focus {
          border-color: #22d3ee;
          background: white;
          box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.1);
        }
        .input:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}

export default MyAccount
