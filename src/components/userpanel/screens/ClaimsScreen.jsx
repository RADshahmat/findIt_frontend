"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
} from "lucide-react"

const ClaimsScreen = ({ report, onBack }) => {
  // Demo claims data
  const claims = [
    {
      id: "claim1",
      claimerName: "John Smith",
      claimerPhone: "+880 1888 999000",
      claimerEmail: "john.smith@example.com",
      claimDate: "2025-07-04T00:00:00.000Z",
      description:
        "This is my iPhone 13 Pro that I lost near Dhaka University. I can provide the IMEI number and purchase receipt as proof.",
      proofDocuments: ["Receipt", "IMEI Number", "Photo ID"],
      status: "pending", // pending, approved, rejected
      urgency: "high",
      additionalInfo: "Lost it while jogging in the morning around 7 AM",
      verificationScore: 92,
    },
    {
      id: "claim2",
      claimerName: "Sarah Ahmed",
      claimerPhone: "+880 1777 888999",
      claimerEmail: "sarah.ahmed@example.com",
      claimDate: "2025-07-03T00:00:00.000Z",
      description:
        "I believe this might be my phone. I lost a similar iPhone near the university area. The screen crack pattern looks familiar.",
      proofDocuments: ["Photo ID"],
      status: "under_review",
      urgency: "medium",
      additionalInfo: "Can describe the wallpaper and apps installed",
      verificationScore: 78,
    },
    {
      id: "claim3",
      claimerName: "Mike Rahman",
      claimerPhone: "+880 1666 777888",
      claimerEmail: "mike.rahman@example.com",
      claimDate: "2025-07-02T00:00:00.000Z",
      description:
        "This looks like my friend's phone. He asked me to check if anyone found it. Can arrange a meeting for verification.",
      proofDocuments: [],
      status: "rejected",
      urgency: "low",
      additionalInfo: "Acting on behalf of the actual owner",
      verificationScore: 45,
    },
    {
      id: "claim4",
      claimerName: "Lisa Khan",
      claimerPhone: "+880 1555 666777",
      claimerEmail: "lisa.khan@example.com",
      claimDate: "2025-07-01T00:00:00.000Z",
      description:
        "This is definitely my iPhone! I can unlock it with my fingerprint and show you my personal photos and messages.",
      proofDocuments: ["Photo ID", "Purchase Receipt", "Insurance Document"],
      status: "approved",
      urgency: "high",
      additionalInfo: "Can provide biometric verification on the spot",
      verificationScore: 98,
    },
  ]

  const [selectedClaim, setSelectedClaim] = useState(null)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-400"
      case "under_review":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400"
      case "approved":
        return "bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/20 dark:text-green-400"
      case "rejected":
        return "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400"
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high":
        return "bg-red-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getVerificationColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400"
    if (score >= 70) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400"
    return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
  }

  const handleApproveClaim = (claim) => {
    console.log("Approving claim:", claim.id)
    // Handle claim approval
  }

  const handleRejectClaim = (claim) => {
    console.log("Rejecting claim:", claim.id)
    // Handle claim rejection
  }

  const handleContactClaimer = (claim) => {
    setSelectedClaim(claim)
    console.log("Contacting claimer:", claim.claimerName)
    // Handle contacting claimer
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Claims for Found Item</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {claims.length} people have claimed "{report?.title}"
            </p>
          </div>
        </div>
      </motion.div>

      {/* Original Report Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-6 border border-green-100 dark:border-green-800"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your Found Item</h3>
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

      {/* Claims List */}
      <div className="space-y-4">
        {claims.map((claim, index) => (
          <motion.div
            key={claim.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {claim.claimerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{claim.claimerName}</h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}
                      >
                        {claim.status.replace("_", " ").toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(claim.urgency)}`}>
                        {claim.urgency.toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${getVerificationColor(claim.verificationScore)}`}
                      >
                        {claim.verificationScore}% Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleContactClaimer(claim)}
                    className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact
                  </motion.button>

                  {claim.status === "pending" && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApproveClaim(claim)}
                        className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRejectClaim(claim)}
                        className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </motion.button>
                    </>
                  )}
                </div>
              </div>

              {/* Claim Description */}
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{claim.description}</p>
                {claim.additionalInfo && (
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Additional Info:</strong> {claim.additionalInfo}
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{claim.claimerPhone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{claim.claimerEmail}</span>
                </div>
              </div>

              {/* Proof Documents */}
              {claim.proofDocuments.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Proof Documents:</h4>
                  <div className="flex flex-wrap gap-2">
                    {claim.proofDocuments.map((doc, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-xs"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Claim Date */}
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>Claimed on {formatDate(claim.claimDate)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No claims message */}
      {claims.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Claims Yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            No one has claimed this item yet. We'll notify you when someone makes a claim.
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default ClaimsScreen
