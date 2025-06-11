

const StatsCard = ({ value, label, index }) => {
  const gradients = [
    'from-pink-600 to-purple-600',
    'from-purple-600 to-blue-600',
    'from-blue-600 to-teal-600'
  ]
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-white p-8 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        className={`text-4xl font-bold bg-gradient-to-r ${gradients[index % gradients.length]} bg-clip-text text-transparent`}
      >
        {value}
      </motion.div>
      <p className="text-center text-gray-600">{label}</p>
    </motion.div>
  )
}

export default StatsCard
