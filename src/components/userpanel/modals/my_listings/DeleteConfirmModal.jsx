
import { motion } from "framer-motion"
import { Trash2, AlertTriangle } from "lucide-react"

const DeleteConfirmModal = ({ onClose, onConfirm, item }) => {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 },
    },
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
        delay: 0.2,
      },
    },
  }

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0  bg-opacity-600 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
      >
        <div className="p-8 text-center">
          {/* Warning Icon */}
          <motion.div
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full"
          >
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 0],
                transition: {
                  duration: 0.5,
                  delay: 0.5,
                  repeat: 1,
                },
              }}
            >
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Delete Item</h3>
            <p className="text-gray-600 mb-2">Are you sure you want to delete</p>
            <p className="text-lg font-semibold text-gray-800 mb-4">"{item?.title}"?</p>
            <p className="text-sm text-gray-500 mb-8">
              This action cannot be undone and will permanently remove this item from your list.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-lg flex items-center justify-center"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Delete
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DeleteConfirmModal
