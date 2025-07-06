"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Calendar, Eye, Phone, Mail, User, MessageCircle, CheckCircle, Clock } from "lucide-react"
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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Matching Found Items</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Found {matches.length} potential matches for "{report?.title}"
            </p>
          </div>
        </div>
      </motion.div>

      {/* Original Report Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 rounded-xl p-6 border border-red-100 dark:border-red-800"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your Lost Item</h3>
        <div className="flex gap-4">
          <img
            src={report?.image || "/placeholder.svg?height=80&width=120"}
            alt={report?.title}
            className="w-20 h-16 object-cover rounded-lg"
          />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">{report?.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{report?.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {report?.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(report?.date)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Matched Items */}
      <div className="space-y-4">
        {matches.map((match, index) => (
          <motion.div
            key={match.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex gap-6">
                {/* Image */}
                <div className="relative w-40 h-32 flex-shrink-0">
                  <img
                    src={`http://localhost:5000/image/${match.image[0]}` || "/placeholder.svg"}
                    alt={match.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(match.status)}`}
                    >
                      {match.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${getMatchColor(match.matchPercentage)}`}
                    >
                      {match.matchPercentage}%
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate">
                        {match.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{match.description}</p>

                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{match.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{formatDate(match.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{match.views} views</span>
                        </div>
                      </div>

                      {/* Finder Info */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Found by: {match.finderName}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-2" />
                            <span>{match.finderPhone}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-2" />
                            <span>{match.finderEmail}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Reported {formatDate(match.date)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleContact(match)}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact
                      </motion.button>

                      {match.status === "pending" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No matches message */}
      {matches.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Matches Found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            We haven't found any matching items yet. We'll notify you when potential matches are reported.
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default MatchedItemsScreen
