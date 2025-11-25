"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Calendar, Shield, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchPeoplePosts } from "../../features/posts/fetchPeoplePosts"
import { cardVariants } from "../CardVariants" // Declare the cardVariants variable

function PeopleSection() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { peopleItems, loading } = useSelector((state) => state.people)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const itemsPerSlide = 5

  useEffect(() => {
    dispatch(fetchPeoplePosts())
  }, [dispatch])

  useEffect(() => {
    if (peopleItems.length === 0) return

    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prev) => (prev + 1 >= Math.ceil(peopleItems.length / itemsPerSlide) ? 0 : prev + 1))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [peopleItems.length, itemsPerSlide, isHovered])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, Math.ceil(peopleItems.length / itemsPerSlide) - 1) : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1 >= Math.ceil(peopleItems.length / itemsPerSlide) ? 0 : prev + 1))
  }

  const handleViewAll = () => {
    navigate("/dashboard?category=People")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "lost":
        return "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400"
      case "found":
        return "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
      default:
        return "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400"
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <section className="p-8 sm:py-10 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
          <div className="flex items-center mb-3">
            <Shield className="h-8 w-8 text-red-500 dark:text-red-400 mr-3" />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Missing People</h2>
          </div>


        <div className="flex text-gray-600 dark:text-gray-400 text-lg mb-8 items-center justify-between">
          <div>Help us find missing people in our community. Share information and help reunite families.</div> 
           {peopleItems.length > 0 && (
            <motion.button
              onClick={handleViewAll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              View All
            </motion.button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 dark:border-cyan-400"></div>
          </div>
        ) : peopleItems.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No missing people reports at this time.</p>
          </motion.div>
        ) : (
          <>
            <div
              className="relative group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Carousel Wrapper */}
              <div className="overflow-hidden rounded-xl">
                <motion.div
                  className="flex gap-4"
                  animate={{
                    x: -(currentIndex * (100 / itemsPerSlide)) + "%",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {peopleItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex-shrink-0 w-full sm:w-1/3 lg:w-1/5"
                      variants={cardVariants}
                      whileHover="hover"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                        {/* Image Container */}
                        <div className="relative h-32 sm:h-40 overflow-hidden bg-gray-200 dark:bg-gray-700">
                          <img
                            src={
                              item.image ||
                              item.images?.[0] ||
                              `http://localhost:5000/image/${item.image?.[0] || "/placeholder.svg"}` ||
                              "/missing-person.jpg"
                            }
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Status Badge */}
                          <div className="absolute top-2 left-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}
                            >
                              {item.status === "lost" ? "MISSING" : "FOUND"}
                            </span>
                          </div>
                          {/* Urgency Badge */}
                          {item.urgency && item.status === "lost" && (
                            <div className="absolute top-2 right-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getUrgencyColor(item.urgency)}`}
                              >
                                {item.urgency.toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-3 flex-1 flex flex-col">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                            {item.title}
                          </h3>

                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 line-clamp-1">
                            {item.description}
                          </p>

                          {/* Info Grid */}
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                              <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-cyan-500" />
                              <span className="truncate">{item.location || "Not specified"}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                              <Calendar className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-cyan-500" />
                              <span>{new Date(item.date || item.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Contact Info */}
                          {(item.contactName || item.postedBy) && (
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mb-3">
                              <p className="text-xs text-gray-900 dark:text-white font-semibold">
                                {item.contactName || item.postedBy}
                              </p>
                              {item.contactPhone && (
                                <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">
                                  {item.contactPhone}
                                </p>
                              )}
                            </div>
                          )}

                          {/* CTA Button */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-md font-semibold transition-all shadow-sm hover:shadow-md text-xs mt-auto"
                          >
                            {item.status === "lost" ? "Help Find" : "View Details"}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {peopleItems.length > itemsPerSlide && (
                <>
                  <motion.button
                    onClick={handlePrev}
                    whileHover={{ scale: 1.1, boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-6 sm:-translate-x-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </motion.button>

                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.1, boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-6 sm:translate-x-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.button>
                </>
              )}

              {peopleItems.length > itemsPerSlide && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: Math.ceil(peopleItems.length / itemsPerSlide) }).map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? "w-8 bg-gradient-to-r from-red-500 to-pink-500"
                          : "w-2 bg-gray-300 dark:bg-gray-600"
                      }`}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </section>
  )
}

export default PeopleSection
