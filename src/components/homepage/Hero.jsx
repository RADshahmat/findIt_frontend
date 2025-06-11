import { ArrowRight, MapPin, Clock } from "lucide-react"
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar"

const Hero = ({ onSearch }) => {
  return (
    <section className="bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-cyan-400 p-8  pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-17">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              <span className="ml-2 text-sm font-medium text-cyan-700">
                Reuniting people with their belongings
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block">Lost something?</span>
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                We'll help to find it.
              </span>
            </h1>

            <p className="text-lg text-slate-600 mb-8">
              Our platform connects people who have lost items with those who
              have found them. With our advanced matching system, we've helped
              thousands of people recover their lost belongings.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="#"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center"
              >
                Report Lost Item
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="#"
                className="px-6 py-3 rounded-lg border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 font-medium transition-all flex items-center justify-center"
              >
                Report Found Item
              </a>
            </div>

            <SearchBar onSearch={onSearch} className="hidden lg:flex" />

            <div className="flex items-center mt-8 text-slate-500 text-sm">
              <div className="flex items-center mr-6">
                <Clock className="h-4 w-4 mr-1 text-cyan-500" />
                <span>Quick matching</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-cyan-500" />
                <span>Location-based search</span>
              </div>
            </div>
          </div>

          {/* Right Column - Image/Illustration */}
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-cyan-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-teal-100 rounded-full opacity-50 blur-3xl"></div>

            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
              <div className="bg-gradient-to-r from-cyan-500 to-teal-500 h-12 flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  <div className="w-3 h-3 rounded-full bg-white/30"></div>
                </div>
                <div className="mx-auto text-white font-medium">
                  FindIt Dashboard
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="text-lg font-semibold text-slate-800 mb-2">
                    Recently Reported Items
                  </div>
                  <div className="h-1 w-20 bg-cyan-500 rounded-full"></div>
                </div>

                {/* Item Cards */}
                <div className="space-y-4">
                  {[
                    {
                      type: "lost",
                      item: "Blue Backpack",
                      location: "Central Park",
                      date: "2 hours ago",
                      reward: "$50",
                    },
                    {
                      type: "found",
                      item: "iPhone 15 Pro",
                      location: "Downtown Coffee Shop",
                      date: "5 hours ago",
                    },
                    {
                      type: "lost",
                      item: "Car Keys with Red Keychain",
                      location: "Shopping Mall",
                      date: "1 day ago",
                      reward: "$30",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-slate-50 rounded-lg p-4 border border-slate-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                item.type === "lost"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {item.type === "lost" ? "LOST" : "FOUND"}
                            </span>
                            <span className="ml-2 font-medium text-slate-800">
                              {item.item}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-slate-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {item.location}
                          </div>
                          <div className="mt-1 text-xs text-slate-400">
                            {item.date}
                          </div>
                        </div>
                        {item.reward && (
                          <div className="bg-cyan-50 text-cyan-700 text-xs font-medium px-2 py-1 rounded">
                            Reward: {item.reward}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Link
                    to="/dashboard"
                    className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    View All Items →
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating Notification */}
            <div className="absolute -top-6 -left-6 bg-white rounded-lg shadow-lg p-3 border border-slate-100 animate-bounce-slow">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-xs font-medium text-slate-800">
                    Item Found!
                  </div>
                  <div className="text-xs text-slate-500">
                    Gold watch returned
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-slate-100">
              <div className="text-xs font-medium text-slate-800">
                Success Rate
              </div>
              <div className="text-lg font-bold text-cyan-600">94%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero
