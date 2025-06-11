import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <motion.div 
      className="rounded-lg border bg-white overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.button
        className="flex w-full items-center justify-between p-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
      >
        <h3 className="text-lg font-medium">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 text-gray-600 border-t">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FaqItem
