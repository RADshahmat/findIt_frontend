"use client"

import { MapPin, Calendar, Eye, Heart, EllipsisVertical, Phone, Mail } from "lucide-react"
import { useState,useEffect } from "react"
import { useDispatch } from "react-redux"
import { submitReportToAdmin } from "../../features/reportToAdmin/reporttoadmin.js"
import { processImageForVerification } from "../../helpers/imageConv.js"

const ListingCard = ({ listing, viewMode = "grid" }) => {
  const dispatch = useDispatch()
  const [showMenu, setShowMenu] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportText, setReportText] = useState("")
  const [reportImages, setReportImages] = useState([]) // multiple images
  const [showFullModal, setShowFullModal] = useState(false)
  const [showContactDropdown, setShowContactDropdown] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [processedImages, setProcessedImages] = useState([]);


  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

useEffect(() => {
  async function convertImages() {
    if (listing.category.toLowerCase() === "people") {
      setProcessedImages(listing.images || [listing.image]);
      return;
    }

    const imgs = listing.images?.length ? listing.images : [listing.image];
    const converted = [];
   // console.log("Original Images:", imgs);
    for (let img of imgs) {
      const blob = await fetch(img).then(res => res.blob());
     // console.log("Original Blob:", blob);
      const processedBlob = await processImageForVerification(blob);
      console.log("Processed Blob:", processedBlob);
      converted.push(URL.createObjectURL(processedBlob));
    }
    console.log("Converted Images:", converted);
    setProcessedImages(converted);
  }

  convertImages();
}, [listing]);

console.log("Processed Images:", processedImages);
  const getStatusColor = (status) => {
    switch (status) {
      case "lost":
        return "bg-red-100 text-red-700 border-red-200"
      case "found":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  //console.log("ListingCard rendered with viewMode:", listing);

  if (viewMode === "list") {
    return (
      <div
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
        onClick={(e) => {
          // Prevent open when clicking menu dots
          if (!e.target.closest(".menu-area")) {
            setShowFullModal(true)
          }
        }}
      >
        <div className="flex">
          {/* Image */}
          <div className="relative w-48 h-32 flex-shrink-0">
            <div className="relative w-48 h-32 flex-shrink-0">
              {!imageLoaded && <div className="w-full h-full bg-gray-200 animate-pulse rounded-sm"></div>}
              <img
                src={listing.image == "" ? "/noimg.svg?height=128&width=192" : processedImages[0]
}
                alt={listing.title}
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0 absolute"
                }`}
              />
            </div>
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(listing.status)}`}>
                {listing.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2 hover:text-cyan-600 transition-colors">
                  {listing.title}
                </h3>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{formatDate(listing.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{listing.views} views</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xs font-medium">
                      {listing.postedBy.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{listing.postedBy}</span>
                  </div>

                  {listing.reward && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      Reward: ৳{listing.reward}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative menu-area">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowContactDropdown(!showContactDropdown)
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white text-sm font-medium rounded-lg transition-all"
                >
                  Contact
                </button>

                {showContactDropdown && (
                  <div className="absolute bottom-10 right-10 mt-2 w-50 bg-amber-100 border border-gray-200 rounded-lg shadow-lg z-100">
                    <a
                      href={`mailto:${listing.postedByEmail}`}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-200"
                    >
                      <Mail className="h-4 w-4 text-cyan-500" />
                      <div className="text-left">
                        <p className="text-xs text-gray-600">Email</p>
                        <p className="text-sm text-gray-900 font-medium">{listing.postedByEmail}</p>
                      </div>
                    </a>
                    <a
                      href={`tel:${listing.postedByPhone}`}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <Phone className="h-4 w-4 text-teal-500" />
                      <div className="text-left">
                        <p className="text-xs text-gray-600">Phone</p>
                        <p className="text-sm text-gray-900 font-medium">{listing.postedByPhone}</p>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={(e) => {
        // Prevent open when clicking menu dots
        if (!e.target.closest(".menu-area")) {
          setShowFullModal(true)
        }
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <div className="relative overflow-hidden ">
          {!imageLoaded && <div className="w-full h-48 bg-gray-200 animate-pulse"></div>}
          <img
            src={listing.image == "" ? "/noimg.svg?height=128&width=192" : (processedImages[0])
}
            alt={listing.title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-48 object-contain group-hover:scale-105 transform transition-all duration-500 ease-in-out ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95 absolute"
            }`}
          />
        </div>

        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(listing.status)}`}>
            {listing.status.toUpperCase()}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex space-x-1">
          <button className="p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors">
            <Heart className="h-3 w-3 text-gray-600" />
          </button>

          {/* 3 dots menu */}
          <div className="relative menu-area">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors"
            >
              <EllipsisVertical className="h-3 w-3 text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-blue-200 shadow-md rounded-md py-1 z-50">
                <button
                  onClick={() => {
                    setShowMenu(false)
                    setShowReportModal(true)
                  }}
                  className="px-3 py-2 text-sm hover:bg-gray-100 w-full text-left"
                >
                  Report
                </button>
              </div>
            )}
          </div>
        </div>

        {listing.reward && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-medium">
              Reward: ৳{listing.reward}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
          {listing.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            <span>{listing.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
            <span>{formatDate(listing.date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Eye className="h-4 w-4 mr-1 text-gray-400" />
            <span>{listing.views} views</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xs font-medium">
              {listing.postedBy.charAt(0).toUpperCase()}
            </div>
            <span className="ml-2 text-sm text-gray-600">{listing.postedBy}</span>
          </div>
          <div className="relative menu-area">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowContactDropdown(!showContactDropdown)
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white text-sm font-medium rounded-lg transition-all"
            >
              Contact
            </button>

            {showContactDropdown && (
              <div className="absolute bottom-10 right-10 mt-2 w-50 bg-amber-100 border border-gray-200 rounded-lg shadow-lg z-100">
                <a
                  href={`mailto:${listing.postedByEmail}`}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-200"
                >
                  <Mail className="h-4 w-4 text-cyan-500" />
                  <div className="text-left">
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm text-gray-900 font-medium">{listing.postedByEmail}</p>
                  </div>
                </a>
                <a
                  href={`tel:${listing.postedByPhone}`}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Phone className="h-4 w-4 text-teal-500" />
                  <div className="text-left">
                    <p className="text-xs text-gray-600">Phone</p>
                    <p className="text-sm text-gray-900 font-medium">{listing.postedByPhone}</p>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Report to Admin</h2>

            {/* Text Input */}
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-red-400"
              rows="4"
              placeholder="Describe the issue..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            />

            {/* Image Upload */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-gray-600">Upload Images (optional)</label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files)
                  setReportImages((prev) => [...prev, ...files])
                }}
                className="block w-full text-sm"
              />
            </div>

            {/* Preview Section */}
            {reportImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {reportImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(img) || "/placeholder.svg"}
                      alt="preview"
                      className="h-20 w-full object-cover rounded-md border"
                    />

                    {/* Remove Icon */}
                    <button
                      onClick={() => setReportImages(reportImages.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow group-hover:block text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowReportModal(false)
                  setReportText("")
                  setReportImages([])
                }}
                className="px-3 py-1.5 bg-gray-200 rounded-md text-sm hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  dispatch(
                    submitReportToAdmin({
                      reportText,
                      reportImages,
                      listingId: listing.id,
                      post_user_id: listing.postedById,
                    }),
                  )
                  setShowReportModal(false)
                  setReportText("")
                  setReportImages([])
                }}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showFullModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100]"
          onClick={() => {
            setShowFullModal(false)
            setShowContactDropdown(false)
            setShowMenu(false)
          }}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 animate-fadeIn overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowFullModal(false)}
              className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all"
            >
              ×
            </button>

            {/* Status Badge */}
            <div className="mb-6">
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border inline-block ${getStatusColor(
                  listing.status,
                )}`}
              >
                {listing.status.toUpperCase()}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-6 text-gray-900 text-balance">{listing.title}</h2>

            {/* Images Section */}
            <div className="mb-8">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {(Array.isArray(listing.images) ? listing.images : [listing.image]).map((img, idx) => (
                  <img
                    key={idx}
                    src={processedImages[idx] || "/noimg.svg?height=200&width=200"}
                    alt="preview"
                    className="h-48 w-48 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0 hover:border-cyan-500 transition-colors"
                  />
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-gray-600 text-sm font-medium">Category</p>
                <p className="text-gray-900 font-semibold mt-1">{listing.category}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Subcategory</p>
                <p className="text-gray-900 font-semibold mt-1">{listing.subcategory}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm font-medium">Date</p>
                <p className="text-gray-900 font-semibold mt-1">{formatDate(listing.date)}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm font-medium">Location</p>
                <p className="text-gray-900 font-semibold mt-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  {listing.location}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-gray-600 text-sm font-medium">Specific Location</p>
                <p className="text-gray-900 font-semibold mt-1">{listing.specificlocation}</p>
              </div>

              {listing.status === "lost" && (
                <div>
                  <p className="text-gray-600 text-sm font-medium">Urgency</p>
                  <p className="text-gray-900 font-semibold mt-1 capitalize">{listing.urgency}</p>
                </div>
              )}

              {listing.status === "found" && listing.handoverPreference && (
                <div>
                  <p className="text-gray-600 text-sm font-medium">Handover Preference</p>
                  <p className="text-gray-900 font-semibold mt-1 capitalize">{listing.handoverPreference}</p>
                </div>
              )}
            </div>

            {/* Additional Details */}
            {listing.additionalDetails && (
              <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-gray-600 text-sm font-medium">Additional Details</p>
                <p className="text-gray-900 mt-2 leading-relaxed">{listing.additionalDetails}</p>
              </div>
            )}

            {/* Reward */}
            {listing.reward && (
              <div className="mb-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-yellow-900 font-semibold text-lg">💰 Reward: ৳{listing.reward}</p>
              </div>
            )}

            {/* Posted By Info */}
            <div className="p-4 bg-gray-100 rounded-xl mb-6">
              <p className="text-gray-600 text-sm font-medium mb-3">Posted by</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                  {listing.postedBy.charAt(0).toUpperCase()}
                </div>
                <p className="ml-3 text-gray-900 font-semibold">{listing.postedBy}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <button
                  onClick={() => setShowFullModal(false)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListingCard
