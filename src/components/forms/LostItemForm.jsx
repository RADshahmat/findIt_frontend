"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, X, MapPin, DollarSign, ChevronDown, AlertTriangle } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCatagories } from "../../features/catagory/catagory"
import districtsData from "../../assets/bd-districts.json"

const LostItemForm = ({
  initialData,
  onSubmit,
  submitButtonText = "Report Lost Item",
  submitButtonClass = "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white",
  isLoading = false,
}) => {
  const dispatch = useDispatch()
  const { catagory, status } = useSelector((state) => state.catagory)
  const [formData, setFormData] = useState({
    reportType: "lost",
    title: "",
    category: "",
    subcategory: "",
    description: "",
    location: "",
    specificLocation: "",
    date: "",
    time: "",
    reward: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    additionalDetails: "",
    urgency: "medium",
    status: "lost",
    ...initialData,
  })
  const [images, setImages] = useState(
    initialData?.images?.map((img, index) => ({
      id: index,
      preview: img,
      url: img,
    })) || [],
  )
  const [errors, setErrors] = useState({})
  const [locationQuery, setLocationQuery] = useState(initialData?.location || "")
  const [showDropdown, setShowDropdown] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const dropdownRef = useRef()

  const locations = districtsData.districts.map((d) => d.name)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCatagories())
    }
  }, [status, dispatch])

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }))
      setLocationQuery(initialData.location || "")
      setImages(
        initialData.images?.map((img, index) => ({
          id: index,
          preview: img,
          url: img,
        })) || [],
      )
    }
  }, [initialData])

  const resetForm = () => {
    setFormData({
      reportType: "lost",
      title: "",
      category: "",
      subcategory: "",
      description: "",
      location: "",
      specificLocation: "",
      date: "",
      time: "",
      reward: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      additionalDetails: "",
      urgency: "medium",
      status: "lost",
    })
    setImages([])
    setLocationQuery("")
    setErrors({})
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" && { subcategory: "" }),
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)

    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed")
      return
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB.`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            file,
            preview: e.target.result,
            name: file.name,
          },
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = "Item title is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.location) newErrors.location = "Location is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.contactName.trim()) newErrors.contactName = "Contact name is required"
    if (!formData.contactPhone.trim()) newErrors.contactPhone = "Phone number is required"
    if (!formData.contactEmail.trim()) newErrors.contactEmail = "Email is required"

    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email"
    }

    if (formData.contactPhone && !/^\+?[\d\s-()]{10,}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value)
    })
    images.forEach((img) => {
      if (img.file) {
        data.append("post_images", img.file)
      }
    })

    try {
      await onSubmit(data)
      setSubmitSuccess(true)
      resetForm()

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const filteredLocations = locations.filter((loc) => loc.toLowerCase().includes(locationQuery.toLowerCase()))

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* Item Information */}
      <motion.div
        variants={sectionVariants}
        className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800"
      >
        <h3 className="text-lg font-semibold mb-4 text-red-800 dark:text-red-200 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Lost Item Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., iPhone 15 Pro Max"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                errors.title ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.title && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1"
              >
                {errors.title}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                errors.category ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <option value="">Select Category</option>
              {catagory.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.lable}
                </option>
              ))}
            </select>
            {errors.category && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1"
              >
                {errors.category}
              </motion.p>
            )}
          </div>

          {formData.category && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subcategory</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select Subcategory</option>
                {catagory
                  .find((c) => c.id === formData.category)
                  ?.subcategories?.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Urgency Level</label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="low">Low - Can wait</option>
              <option value="medium">Medium - Important</option>
              <option value="high">High - Very urgent</option>
              <option value="critical">Critical - Emergency</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Provide detailed description including color, size, brand, distinctive features, etc."
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
              errors.description ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.description && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs mt-1"
            >
              {errors.description}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Location & Time */}
      <motion.div variants={sectionVariants} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-red-500" />
          Where & When Lost
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City/Area *</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Select City"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onClick={() => setShowDropdown(true)}
                onFocus={() => setShowDropdown(true)}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                  errors.location ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
            </div>

            {showDropdown && filteredLocations.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 w-full mt-1 rounded-lg max-h-60 overflow-y-auto shadow-lg"
              >
                {filteredLocations.map((loc, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, location: loc }))
                      setLocationQuery(loc)
                      setShowDropdown(false)
                      setErrors((prev) => ({ ...prev, location: "" }))
                    }}
                    className="px-4 py-2 cursor-pointer text-gray-900 dark:text-white"
                  >
                    {loc}
                  </motion.li>
                ))}
              </motion.ul>
            )}
            {errors.location && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1"
              >
                {errors.location}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specific Location</label>
            <input
              type="text"
              name="specificLocation"
              value={formData.specificLocation}
              onChange={handleInputChange}
              placeholder="e.g., Dhanmondi 27, near TSC"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Lost *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              max={new Date().toISOString().split("T")[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                errors.date ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.date && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1"
              >
                {errors.date}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Approximate Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </motion.div>

      {/* Images */}
      <motion.div variants={sectionVariants} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Images (Optional)</h3>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">Click to upload images</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Maximum 5 images, 5MB each</p>
          </label>
        </div>

        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4"
          >
            {images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <img
                  src={image.preview || image.url || "/placeholder.svg"}
                  alt={image.name}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Reward */}
      <motion.div
        variants={sectionVariants}
        className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800"
      >
        <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200 flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Reward (Optional)
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reward Amount (৳)</label>
          <input
            type="number"
            name="reward"
            value={formData.reward}
            onChange={handleInputChange}
            placeholder="e.g., 5000"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div variants={sectionVariants} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name *</label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                errors.contactName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.contactName && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1"
              >
                {errors.contactName}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              placeholder="+880 1234 567890"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                errors.contactPhone ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.contactPhone && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1"
              >
                {errors.contactPhone}
              </motion.p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                errors.contactEmail ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.contactEmail && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1"
              >
                {errors.contactEmail}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Additional Details */}
      <motion.div variants={sectionVariants} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Additional Details</h3>
        <textarea
          name="additionalDetails"
          value={formData.additionalDetails}
          onChange={handleInputChange}
          rows={3}
          placeholder="Any additional information that might help..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </motion.div>
      {/* Success Message */}
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 p-4 rounded-lg mb-6"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Lost item report created successfully! The form has been reset.
          </div>
        </motion.div>
      )}
      {/* Submit Button */}
      <motion.div
        variants={sectionVariants}
        className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-600"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className={`px-8 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium ${submitButtonClass}`}
        >
          {submitButtonText}
        </motion.button>
      </motion.div>
    </motion.form>
  )
}

export default LostItemForm
