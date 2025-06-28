import { MapPin, Calendar, Eye, Heart, Share2 } from "lucide-react"
import { useState } from "react"

const ListingCard = ({ listing, viewMode = "grid" }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

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

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="flex">
          {/* Image */}
          <div className="relative w-48 h-32 flex-shrink-0">
            <div className="relative w-48 h-32 flex-shrink-0">
              {!imageLoaded && (
                <div className="w-full h-full bg-gray-200 animate-pulse rounded-sm"></div>
              )}
              <img
                src={listing.image || "/placeholder.svg?height=128&width=192"}
                alt={listing.title}
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0 absolute"
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

              <button className="ml-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white text-sm font-medium rounded-lg transition-all">
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <div className="relative overflow-hidden">
          {!imageLoaded && (
            <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
          )}
          <img
            src={listing.image || "/placeholder.svg?height=200&width=300"}
            alt={listing.title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-48 object-cover group-hover:scale-105 transform transition-all duration-500 ease-in-out ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95 absolute"
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
          <button className="p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors">
            <Share2 className="h-3 w-3 text-gray-600" />
          </button>
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
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white text-sm font-medium rounded-lg transition-all">
            Contact
          </button>
        </div>
      </div>
    </div>
  )
}

export default ListingCard
