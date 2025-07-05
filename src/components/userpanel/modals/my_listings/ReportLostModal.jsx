
import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { X, AlertTriangle, MapPin, ChevronDown } from "lucide-react"
import { createPost } from "../../../../features/posts/post"
import districtsData from "../../../../assets/bd-districts.json"

const ReportLostModal = ({ onClose, onSubmit, item }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.post)
  const dropdownRef = useRef()

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    description: "",
    location: "",
    specificLocation: "",
    date: "",
    time: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    additionalDetails: "",
    urgency: "medium",
    status: "lost",
    reportType: "lost",
  })

  const [locationQuery, setLocationQuery] = useState("")
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)

  const locations = districtsData.districts.map((d) => d.name)
  const filteredLocations = locations.filter((loc) => loc.toLowerCase().includes(locationQuery.toLowerCase()))

  useEffect(() => {
    if (item) {
      setFormData((prev) => ({
        ...prev,
        title: item.title,
        category: item.category,
        subcategory: item.subcategory,
        description: item.description,
      }))
    }
  }, [item])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value)
    })
    dispatch(createPost(data))
    onSubmit()
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 },
    },
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0  bg-opacity-100 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
          <div className="flex items-center justify-between text-white">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center"
            >
              <AlertTriangle className="h-6 w-6 mr-3" />
              <h2 className="text-2xl font-bold">Report Lost Item</h2>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </motion.button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Item Info (Read-only) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200"
            >
              <h3 className="font-bold text-lg mb-4 text-gray-800">Item Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                  <input
                    type="text"
                    value={formData.title}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={`${formData.category} - ${formData.subcategory}`}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm"
                  />
                </div>
              </div>
            </motion.div>

            {/* Location & Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200"
            >
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-bold text-lg text-gray-800">Where & When Lost</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div ref={dropdownRef} className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">City/Area *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Select City"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      onClick={() => setShowLocationDropdown(true)}
                      onFocus={() => setShowLocationDropdown(true)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
                    />
                    <ChevronDown
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                      onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                    />
                  </div>

                  {showLocationDropdown && filteredLocations.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 bg-white border border-gray-300 w-full mt-2 rounded-xl max-h-60 overflow-y-auto shadow-xl"
                    >
                      {filteredLocations.map((loc, index) => (
                        <motion.li
                          key={index}
                          whileHover={{ backgroundColor: "#fef2f2" }}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, location: loc }))
                            setLocationQuery(loc)
                            setShowLocationDropdown(false)
                          }}
                          className="px-4 py-3 cursor-pointer hover:bg-red-50 transition-colors"
                        >
                          {loc}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Specific Location</label>
                  <input
                    type="text"
                    name="specificLocation"
                    value={formData.specificLocation}
                    onChange={handleInputChange}
                    placeholder="e.g., Near TSC, Dhaka University"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Date Lost *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Approximate Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200"
            >
              <h3 className="font-bold text-lg mb-4 text-gray-800">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Your Name *</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Phone Number *</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
                    placeholder="+880 1234 567890"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address *</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </motion.div>

            {/* Additional Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Additional Details</label>
              <textarea
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleInputChange}
                rows={4}
                placeholder="Any additional information about the circumstances of loss..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white resize-none"
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 pt-6 border-t border-gray-200"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 font-medium shadow-lg flex items-center justify-center"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <AlertTriangle className="h-5 w-5 mr-2" />
                )}
                {loading ? "Reporting..." : "Report as Lost"}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ReportLostModal
