"use client"

import { use, useState, useEffect, useRef } from "react"
import { Upload, X, MapPin, DollarSign, AlertCircle, ArrowLeft } from "lucide-react"
import { fetchCatagories } from "../../features/catagory/catagory"
import { useDispatch, useSelector } from "react-redux";
import { createPost, resetPostState } from "../../features/posts/post";
import districtsData from "../../assets/bd-districts.json";
import { ChevronDown } from "lucide-react";

const ReportLostItem = ({ onBack }) => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.post);
  const [formData, setFormData] = useState({
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
  const [images, setImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [locationQuery, setLocationQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const { catagory, status } = useSelector(state => state.catagory);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCatagories());
    }
    if (success) {
      console.log("Post created successfully, resetting form state");
      setFormData({
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
      });
      setImages([]);
    }
  }, [status, dispatch, success]);

  const locations = districtsData.districts.map(d => d.name);


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset subcategory when category changes
      ...(name === "category" && { subcategory: "" }),
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const filteredLocations = locations.filter((loc) =>
    loc.toLowerCase().includes(locationQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)

    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed")
      return
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
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

    // Email validation
    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email"
    }

    // Phone validation (basic)
    if (formData.contactPhone && !/^\+?[\d\s-()]{10,}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("Form data before validation:", formData);
    const isValid = validateForm();
    if (!isValid) return;
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    images.forEach((img) => {
      data.append("post_images", img.file);
    });
    dispatch(createPost(data));
    setIsSubmitting(true);
  };


  //console.log("ReportLostItem component rendered with categories:", catagory);
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-lg">
          <div className="flex items-center text-white">
            <button onClick={onBack} className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Report Lost Item</h1>
              <p className="text-red-100 mt-1">Help us help you find your lost item</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Item Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Item Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., iPhone 15 Pro Max"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                >
                  <option value="">Select Category</option>
                  {catagory.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.lable}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              {formData.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select Subcategory</option>
                    {catagory
                      .find((c) => c.id === formData.category)
                      ?.subcategories
                      ?.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}

                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="low">Low - Can wait</option>
                  <option value="medium">Medium - Important</option>
                  <option value="high">High - Very urgent</option>
                  <option value="critical">Critical - Emergency</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Provide detailed description including color, size, brand, distinctive features, etc."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.description ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Location & Time */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-red-500" />
              Location & Time
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div ref={dropdownRef} className="relative w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">City/Area *</label>

                <div className="relative">
                  <input
                    type="text"
                    readOnly={!showDropdown}
                    placeholder="Select City"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onClick={() => {
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.location ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowDropdown((prev) => !prev)}
                  />
                </div>

                {showDropdown && filteredLocations.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg max-h-60 overflow-y-auto shadow-md">
                    {filteredLocations.map((loc, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, location: loc }));
                          setLocationQuery(loc);
                          setShowDropdown(false);
                          setErrors((prev) => ({ ...prev, location: "" }));
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-red-100"
                      >
                        {loc}
                      </li>
                    ))}
                  </ul>
                )}

                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                )}
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specific Location</label>
                <input
                  type="text"
                  name="specificLocation"
                  value={formData.specificLocation}
                  onChange={handleInputChange}
                  placeholder="e.g., Dhanmondi 27, near TSC"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Lost *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.date ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Approximate Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Images (Optional)</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                <p className="text-gray-600 mb-2">Click to upload images</p>
                <p className="text-sm text-gray-500">Maximum 5 images, 5MB each</p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                {images.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.preview || "/placeholder.svg"}
                      alt={image.name}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reward */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-500" />
              Reward (Optional)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reward Amount (৳)</label>
                <input
                  type="number"
                  name="reward"
                  value={formData.reward}
                  onChange={handleInputChange}
                  placeholder="e.g., 5000"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Contact Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.contactName ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="+880 1234 567890"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.contactPhone ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.contactEmail ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Additional Details</h2>
            <textarea
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any additional information that might help (circumstances of loss, sentimental value, etc.)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          {success && isSubmitting && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
              <div className="flex items-center">Post Created Successfully. </div> </div>)}
          {error && isSubmitting && (
            <div className="bg-green-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <div className="flex items-center">{error.message} </div> </div>)}
          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Submit Lost Item Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReportLostItem
