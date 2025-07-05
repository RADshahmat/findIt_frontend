"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle, CheckCircle } from "lucide-react"
import { useDispatch, /* useSelector */ } from "react-redux"
import { updateReport } from "../../../../features/reports/reportsSlice"
import LostItemForm from "../../../forms/LostItemForm"
import FoundItemForm from "../../../forms/FoundItemForm"

const EditReportModal = ({ report, onClose }) => {
  const dispatch = useDispatch()
  //const { loading } = useSelector((state) => state.reports)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      // Convert FormData to regular object for update
      const updateData = {}
      for (const [key, value] of formData.entries()) {
        if (key !== "post_images") {
          updateData[key] = value
        }
      }

      await dispatch(updateReport({ id: report.id, ...updateData })).unwrap()
      onClose()
    } catch (error) {
      console.error("Error updating report:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  }

  if (!report) return null

  return (
    <AnimatePresence>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div
            className={`p-6 border-b border-gray-200 dark:border-gray-700 ${
              report.status === "lost"
                ? "bg-gradient-to-r from-red-500 to-pink-500"
                : "bg-gradient-to-r from-green-500 to-emerald-500"
            }`}
          >
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center">
                {report.status === "lost" ? (
                  <AlertCircle className="h-6 w-6 mr-2" />
                ) : (
                  <CheckCircle className="h-6 w-6 mr-2" />
                )}
                <h2 className="text-xl font-bold">Edit {report.status === "lost" ? "Lost" : "Found"} Item Report</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {report.status === "lost" ? (
              <LostItemForm
                initialData={report}
                onSubmit={handleSubmit}
                submitButtonText={
                  isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Lost Item Report"
                  )
                }
                submitButtonClass="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                isLoading={isSubmitting}
              />
            ) : (
              <FoundItemForm
                initialData={report}
                onSubmit={handleSubmit}
                submitButtonText={
                  isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Found Item Report"
                  )
                }
                submitButtonClass="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                isLoading={isSubmitting}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default EditReportModal
