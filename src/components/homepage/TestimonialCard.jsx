

const TestimonialCard = ({ content, author, location, index }) => {
  const gradients = [
    'from-pink-600 to-purple-600',
    'from-purple-600 to-blue-600',
    'from-blue-600 to-teal-600',
    'from-teal-600 to-green-600'
  ]
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="flex flex-col justify-between rounded-lg border p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200 h-full"
    >
      <div className="space-y-4">
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg 
              key={star} 
              className="h-5 w-5 text-yellow-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-gray-600 italic">
          "{content}"
        </p>
      </div>
      <div className="flex items-center space-x-4 pt-4 mt-4 border-t">
        <div className={`rounded-full bg-gradient-to-r ${gradients[index % gradients.length]} h-10 w-10 flex items-center justify-center text-white font-bold`}>
          {author.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium">{author}</p>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default TestimonialCard
