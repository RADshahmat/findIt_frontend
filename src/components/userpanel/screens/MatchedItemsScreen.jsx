"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Calendar, Eye, Phone, Mail, User, MessageCircle, CheckCircle, Clock, Star } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { fetchMatchess } from "../../../features/matching/matching"

const MatchedItemsScreen = ({ report, onBack }) => {
  const dispatch = useDispatch();
  const { matches = [], loading, error } = useSelector((state) => state.matches || { matches: [], loading: false, error: null });
  console.log("MatchedItemsScreen rendered with matches:", matches)

  useEffect(() => {
    if (report && report.id) {
      console.log("Fetching matches for report ID:", report.id)
      dispatch(fetchMatchess(report.id))
    } else {
      console.warn("No report ID provided to fetch matches")
    }
  }, [dispatch,report]);

  const matchedItems = [
    {
      id: "match1",
      title: "Similar Person Found",
      description: "Found a person matching the description in Patuakhali area. Wearing similar clothes.",
      location: "Patuakhali Sadar",
      date: "2025-07-04T00:00:00.000Z",
      image: "/placeholder.svg?height=128&width=160",
      finderName: "Ahmed Hassan",
      finderPhone: "+880 1777 888999",
      finderEmail: "ahmed@example.com",
      matchPercentage: 95,
      status: "pending",
      views: 12,
    },
    {
      id: "match2",
      title: "Person Spotted",
      description: "Saw someone matching this description near the bus station. They seemed lost.",
      location: "Patuakhali Bus Terminal",
      date: "2025-07-03T00:00:00.000Z",
      image: "/placeholder.svg?height=128&width=160",
      finderName: "Fatima Khan",
      finderPhone: "+880 1666 777888",
      finderEmail: "fatima@example.com",
      matchPercentage: 87,
      status: "contacted",
      views: 8,
    },
    {
      id: "match3",
      title: "Possible Match",
      description: "Found someone with similar appearance. Not 100% sure but worth checking.",
      location: "Patuakhali Hospital",
      date: "2025-07-02T00:00:00.000Z",
      image: "/placeholder.svg?height=128&width=160",
      finderName: "Dr. Rahman",
      finderPhone: "+880 1555 666777",
      finderEmail: "rahman@example.com",
      matchPercentage: 78,
      status: "verified",
      views: 15,
    },
  ]

  const [selectedMatch, setSelectedMatch] = useState(null)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400"
    if (percentage >= 80) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400"
    return "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400"
      case "contacted":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400"
      case "verified":
        return "bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/20 dark:text-green-400"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400"
    }
  }

  const handleContact = (match) => {
    setSelectedMatch(match)
    // Here you would typically open a contact modal or initiate contact
    console.log("Contacting:", match.finderName)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -2, scale: 1.01 },
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
                    Found {matches.length} potential matches for your lost item
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
              {matches.map((item, index) => (
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
                      src={`http://93.127.166.229:5000/image/${item.image[0]}`}
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
                        <span className="ml-2 text-xs text-green-600 dark:text-green-400">({item.distance?item.distance:'500'})</span>
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
                          <span className="text-sm text-gray-600 dark:text-gray-400">4.5</span>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">{item.finderName}</p>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Phone className="h-3 w-3 mr-2" />
                          <span>{item.finderPhone}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Mail className="h-3 w-3 mr-2" />
                          <span>{item.finderEmail}</span>
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