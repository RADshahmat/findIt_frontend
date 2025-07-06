"use client"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Star,
  Shield,
} from "lucide-react"

const ClaimsScreen = ({ reportId, onBack }) => {
  // Mock data for claims
  const claims = [
    {
      id: 1,
      claimer: {
        name: "Emily Rodriguez",
        phone: "+1 (555) 234-5678",
        email: "emily.rodriguez@email.com",
        rating: 4.9,
        verified: true,
      },
      claimDate: "2024-01-16",
      description:
        "This is definitely my wallet! I lost it yesterday while jogging in Central Park. It has my driver's license, credit cards, and a photo of my dog inside.",
      proofDocuments: [
        { type: "ID", name: "Driver's License Photo" },
        { type: "Receipt", name: "Recent Purchase Receipt" },
      ],
      verificationScore: 95,
      status: "pending",
      location: "Central Park, NYC",
      additionalInfo:
        "I can provide additional identification if needed. The wallet also has a small tear on the back corner.",
    },
    {
      id: 2,
      claimer: {
        name: "David Chen",
        phone: "+1 (555) 345-6789",
        email: "david.chen@email.com",
        rating: 4.7,
        verified: true,
      },
      claimDate: "2024-01-15",
      description:
        "I believe this might be my wallet. I lost it around the same area and time. It's black leather with multiple card slots.",
      proofDocuments: [{ type: "Bank", name: "Bank Statement" }],
      verificationScore: 78,
      status: "under_review",
      location: "Near Central Park",
      additionalInfo: "I have bank statements showing transactions from cards that should be in the wallet.",
    },
    {
      id: 3,
      claimer: {
        name: "Michael Thompson",
        phone: "+1 (555) 456-7890",
        email: "michael.t@email.com",
        rating: 4.5,
        verified: false,
      },
      claimDate: "2024-01-14",
      description: "This looks like my wallet. I lost it last week somewhere in Manhattan.",
      proofDocuments: [],
      verificationScore: 45,
      status: "rejected",
      location: "Manhattan, NYC",
      additionalInfo: "No additional proof provided.",
    },
    {
      id: 4,
      claimer: {
        name: "Lisa Wang",
        phone: "+1 (555) 567-8901",
        email: "lisa.wang@email.com",
        rating: 4.8,
        verified: true,
      },
      claimDate: "2024-01-17",
      description:
        "I'm confident this is my wallet. I can describe the contents in detail and provide proof of ownership for all items inside.",
      proofDocuments: [
        { type: "ID", name: "Passport Copy" },
        { type: "Card", name: "Credit Card Statement" },
        { type: "Photo", name: "Wallet Purchase Receipt" },
      ],
      verificationScore: 92,
      status: "approved",
      location: "Central Park East",
      additionalInfo: "I have the original purchase receipt for the wallet and can describe unique identifying marks.",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "under_review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getVerificationColor = (score) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 70) return "text-blue-600 dark:text-blue-400"
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "under_review":
        return <FileText className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
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
              className="p-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-800 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Claims
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{claims.length} people have claimed this item</p>
            </div>
          </div>
        </motion.div>

        {/* Claims Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {claims.map((claim, index) => (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{claim.claimer.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{claim.claimer.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-300 fill-current" />
                          <span className="text-white/80 text-sm">{claim.claimer.rating}</span>
                        </div>
                        {claim.claimer.verified && (
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-green-300" />
                            <span className="text-white/80 text-xs">Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}
                    >
                      {getStatusIcon(claim.status)}
                      <span>{claim.status.replace("_", " ").toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Verification Score */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Verification Score</span>
                    <span className={`text-lg font-bold ${getVerificationColor(claim.verificationScore)}`}>
                      {claim.verificationScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${claim.verificationScore}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-2 rounded-full ${
                        claim.verificationScore >= 90
                          ? "bg-green-500"
                          : claim.verificationScore >= 70
                            ? "bg-blue-500"
                            : claim.verificationScore >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      }`}
                    />
                  </div>
                </motion.div>

                {/* Claim Details */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3 mb-4"
                >
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                    <span>Claimed on {new Date(claim.claimDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                    <span>{claim.location}</span>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-4"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Claim Description</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{claim.description}</p>
                </motion.div>

                {/* Proof Documents */}
                {claim.proofDocuments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-4"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Proof Documents</h4>
                    <div className="space-y-2">
                      {claim.proofDocuments.map((doc, docIndex) => (
                        <div key={docIndex} className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-green-500 dark:text-green-400" />
                          <span className="text-gray-600 dark:text-gray-400">{doc.name}</span>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs">
                            {doc.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 mb-4"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Contact Information</h4>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Phone className="h-3 w-3 mr-2" />
                      <span>{claim.claimer.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="h-3 w-3 mr-2" />
                      <span>{claim.claimer.email}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Additional Info */}
                {claim.additionalInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mb-4"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Additional Information</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{claim.additionalInfo}</p>
                  </motion.div>
                )}

                {/* Action Buttons */}
                {claim.status === "pending" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex gap-3"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm font-medium"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-all duration-200 text-sm font-medium"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ClaimsScreen
