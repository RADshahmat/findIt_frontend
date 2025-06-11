import { ArrowRight } from "lucide-react"

const CTA = () => {
  return (
    <section className="container py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 opacity-10"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-200 rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-200 rounded-full opacity-50 blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left column - Image/Illustration */}
            <div className="bg-gradient-to-br from-cyan-500 to-teal-500 p-8 lg:p-12 flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500"></div>
                    </div>
                    <div className="ml-4">
                      <div className="text-white font-semibold">FindIt App</div>
                      <div className="text-white/70 text-sm">Mobile Experience</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                          L
                        </div>
                        <div className="ml-3">
                          <div className="text-white text-sm font-medium">Lost Item Alert</div>
                          <div className="text-white/70 text-xs">iPhone 15 Pro • 2 miles away</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">
                          F
                        </div>
                        <div className="ml-3">
                          <div className="text-white text-sm font-medium">Found Item Report</div>
                          <div className="text-white/70 text-xs">Gold Watch • Central Park</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="text-center">
                        <div className="text-white text-sm font-medium">Download the mobile app</div>
                        <div className="text-white/70 text-xs mt-1">For iOS and Android</div>
                        <div className="mt-3 flex justify-center space-x-2">
                          <div className="w-24 h-8 bg-black rounded-md"></div>
                          <div className="w-24 h-8 bg-black rounded-md"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-2 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-2">
                  <div className="text-xs font-medium text-cyan-600">94% Success</div>
                </div>
              </div>
            </div>

            {/* Right column - Text content */}
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-4 text-slate-800">Ready to Find What You've Lost?</h2>
              <p className="text-lg text-slate-600 mb-8">
                Join thousands of people who have successfully recovered their lost items through our platform. It's
                quick, easy, and free to get started.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-slate-800">Free Basic Account</h3>
                    <p className="text-slate-600">Report lost or found items at no cost</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-slate-800">Secure Platform</h3>
                    <p className="text-slate-600">Your information is always protected</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-slate-800">Mobile App</h3>
                    <p className="text-slate-600">Available for iOS and Android</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-slate-800">24/7 Support</h3>
                    <p className="text-slate-600">Help is always available when you need it</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="px-6 py-3 rounded-lg border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 font-medium transition-all flex items-center justify-center"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
