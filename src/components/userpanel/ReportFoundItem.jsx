"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { createPost } from "../../features/posts/post"
import FoundItemForm from "../forms/FoundItemForm"

const ReportFoundItem = ({ onBack }) => {
  const dispatch = useDispatch()
  const { loading, success, error } = useSelector((state) => state.post)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      await dispatch(createPost(formData)).unwrap()
      // Reset form will be handled by the form component itself
    } catch (err) {
      console.error("Error creating post:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-t-lg"
        >
          <div className="flex items-center text-white">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <CheckCircle className="h-6 w-6 mr-2" />
                Report Found Item
              </h1>
              <p className="text-green-100 mt-1">Help return this item to its owner</p>
            </div>
          </div>
        </motion.div>

        <div className="p-6">
          {/* Success/Error Messages */}
          {success && isSubmitting && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 p-4 rounded-lg mb-6"
            >
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Found item report created successfully!
              </div>
            </motion.div>
          )}

          {error && isSubmitting && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6"
            >
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {error.message || "Failed to create report. Please try again."}
              </div>
            </motion.div>
          )}

          {/* Found Item Form */}
          <FoundItemForm
            onSubmit={handleSubmit}
            submitButtonText={
              loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4" />
                  Submit Found Report
                </div>
              )
            }
            submitButtonClass="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            isLoading={loading}
          />

          {/* Cancel Button */}
          <div className="flex justify-start pt-6 border-t border-gray-200 dark:border-gray-600 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ReportFoundItem
