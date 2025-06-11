import { motion } from 'framer-motion'

const HeroImage = () => {
  return (
    <div className="relative w-full h-full max-w-[500px] max-h-[500px]">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-3xl opacity-30"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-10"
      >
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30"></div>
          <div className="relative bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-sm text-gray-500">FindIt App</div>
            </div>
            
            <div className="space-y-4">
              <div className="h-10 bg-gradient-to-r from-pink-50 to-purple-50 rounded flex items-center px-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                <div className="text-sm text-gray-700">Search for lost items...</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-br from-pink-50 to-pink-100 p-3 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full mb-2 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-xs font-medium">Keys</div>
                  <div className="text-xs text-gray-500">3 found nearby</div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mb-2 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-xs font-medium">Wallet</div>
                  <div className="text-xs text-gray-500">1 found today</div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-2 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-xs font-medium">Phone</div>
                  <div className="text-xs text-gray-500">5 found this week</div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-br from-teal-50 to-teal-100 p-3 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mb-2 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                    </svg>
                  </div>
                  <div className="text-xs font-medium">Bag</div>
                  <div className="text-xs text-gray-500">2 found nearby</div>
                </motion.div>
              </div>
              
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg flex items-center"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Map View</div>
                  <div className="text-xs text-gray-500">12 items found in your area</div>
                </div>
              </motion.div>
              
              <div className="flex justify-between items-center">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm rounded-md"
                >
                  Report Lost Item
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 bg-white border border-gray-200 text-sm rounded-md"
                >
                  View All
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute -left-16 top-20 bg-white p-3 rounded-lg shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-xs">
              <div className="font-medium">Item Found!</div>
              <div className="text-gray-500">2 mins ago</div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="absolute -right-10 bottom-20 bg-white p-3 rounded-lg shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="text-xs">
              <div className="font-medium">New Alert</div>
              <div className="text-gray-500">Match found</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HeroImage
