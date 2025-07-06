"use client"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Calendar, Phone, Mail, CheckCircle, MessageCircle, Star } from "lucide-react"

const MatchedItemsScreen = ({ reportId, onBack }) => {
  // Mock data for matched items
  const matchedItems = [
    {
      id: 1,
      title: "Black Leather Wallet",
      description: "Found a black leather wallet with multiple cards inside",
      image: "/placeholder.svg?height=200&width=300",
      location: "Central Park, NYC",
      date: "2024-01-15",
      matchPercentage: 95,
      finder: {
        name: "John Smith",
        phone: "+1 (555) 123-4567",
        email: "john.smith@email.com",
        rating: 4.8,
      },
      status: "pending",
      distance: "0.2 miles away",
    },
    {
      id: 2,
      title: "Dark Brown Wallet",
      description: "Brown leather wallet found near the subway station",
      image: "/placeholder.svg?height=200&width=300",
      location: "Times Square Station",
      date: "2024-01-14",
      matchPercentage: 87,
      finder: {
        name: "Sarah Johnson",
        phone: "+1 (555) 987-6543",
        email: "sarah.j@email.com",
        rating: 4.9,
      },
      status: "contacted",
      distance: "1.5 miles away",
    },
    {
      id: 3,
      title: "Leather Wallet - Black",
      description: "Small black wallet with credit cards, found in taxi",
      image: "/placeholder.svg?height=200&width=300",
      location: "Manhattan, NYC",
      date: "2024-01-13",
      matchPercentage: 78,
      finder: {
        name: "Mike Davis",
        phone: "+1 (555) 456-7890",
        email: "mike.davis@email.com",
        rating: 4.6,
      },
      status: "verified",
      distance: "2.1 miles away",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "contacted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return "text-green-600 dark:text-green-400"
    if (percentage >= 80) return "text-blue-600 dark:text-blue-400"
    if (percentage >= 70) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Matched Items
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Found {matchedItems.length} potential matches for your lost item
              </p>
            </div>
          </div>
        </motion.div>

        {/* Matched Items Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {matchedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              {/* Image and Match Percentage */}
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Match Percentage */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-3 left-3"
                >
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className={`text-sm font-bold ${getMatchColor(item.matchPercentage)}`}>
                      {item.matchPercentage}% Match
                    </span>
                  </div>
                </motion.div>

                {/* Status Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-3 right-3"
                >
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status?.toUpperCase()}
                  </span>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title and Distance */}
                <div className="flex items-start justify-between mb-3">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2 flex-1"
                  >
                    {item.title}
                  </motion.h3>
                </div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2"
                >
                  {item.description}
                </motion.p>

                {/* Location and Date */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2 mb-4"
                >
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                    <span>{item.location}</span>
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400">({item.distance})</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </motion.div>

                {/* Finder Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 mb-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Finder</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.finder.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">{item.finder.name}</p>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Phone className="h-3 w-3 mr-2" />
                      <span>{item.finder.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="h-3 w-3 mr-2" />
                      <span>{item.finder.email}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 text-sm font-medium"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Contact</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm font-medium"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Verify</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default MatchedItemsScreen
