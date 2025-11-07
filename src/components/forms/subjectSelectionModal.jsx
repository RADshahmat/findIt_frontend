"use client"
import { motion } from "framer-motion"

export default function SubjectSelectionModal({ isOpen, imagePreview, segments, onSelect, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl p-6 w-full max-w-4xl shadow-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select the Subject</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <p className="text-sm text-gray-500 mb-2">Original</p>
            <div className="border rounded-lg overflow-hidden">
              <img src={imagePreview} alt="original" className="w-full h-72 object-contain bg-gray-50" />
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 mb-2">Detected subjects (click to select)</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto p-1">
              {segments?.length ? (
                segments.map((seg) => (
                  <motion.div
                    key={seg.id}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => onSelect(seg)}
                    className="cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <img
                      src={`data:image/png;base64,${seg.outline}`}
                      alt={`seg-${seg.id}`}
                      className="w-full h-28 object-cover"
                    />
                    <div className="p-2 text-xs text-center text-gray-600 dark:text-gray-300">Mask #{seg.id}</div>
                  </motion.div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No subjects detected.</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}
