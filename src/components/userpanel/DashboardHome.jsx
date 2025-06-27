"use client"

import { User, Mail, Eye, List, Star, Plus, MessageCircle, TrendingUp, MapPin, Calendar } from "lucide-react"

const DashboardHome = ({ setActiveSection }) => {
  const stats = [
    { label: "Mail", value: 0, icon: Mail, color: "text-blue-600" },
    { label: "Visit", value: 0, icon: Eye, color: "text-green-600" },
    { label: "Listing", value: 0, icon: List, color: "text-purple-600" },
    { label: "Favorite", value: 0, icon: Star, color: "text-yellow-600" },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "listing",
      title: "iPhone 15 Pro Max reported lost",
      location: "Dhaka, Bangladesh",
      time: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      type: "match",
      title: "Potential match found for your wallet",
      location: "Chattogram, Bangladesh",
      time: "5 hours ago",
      status: "pending",
    },
    {
      id: 3,
      type: "message",
      title: "New message from John Doe",
      location: "About: Lost car keys",
      time: "1 day ago",
      status: "unread",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold mb-2">Hello Rad! 👋</h1>
            <p className="text-cyan-100 text-sm">You last logged in at: Jun 25th, 2025 at 15:33</p>
          </div>
          <div className="hidden md:block">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setActiveSection("create-report")}
            className="flex items-center p-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Report Lost Item
          </button>
          <button
            onClick={() => setActiveSection("create-report")}
            className="flex items-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Report Found Item
          </button>
          <button
            onClick={() => setActiveSection("my-listings")}
            className="flex items-center p-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all text-sm"
          >
            <List className="h-4 w-4 mr-2" />
            View My Listings
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                {activity.type === "listing" && <List className="h-4 w-4 text-cyan-600" />}
                {activity.type === "match" && <TrendingUp className="h-4 w-4 text-green-600" />}
                {activity.type === "message" && <MessageCircle className="h-4 w-4 text-blue-600" />}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 text-sm">{activity.title}</h3>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {activity.location}
                  <span className="mx-2">•</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  {activity.time}
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === "active"
                    ? "bg-green-100 text-green-700"
                    : activity.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                }`}
              >
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
