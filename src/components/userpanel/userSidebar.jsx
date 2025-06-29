"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Home,
  Plus,
  List,
  Clock,
  Archive,
  Heart,
  MessageCircle,
  Search,
  User,
  Settings,
  LogOut,
  Trash2,
  Bell,
  ChevronDown,
  ChevronRight,
  X,
  FileText,
  MapPin,
} from "lucide-react"

const UserSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [expandedSections, setExpandedSections] = useState({
    listings: true,
    account: true,
  })
  const [isMobile, setIsMobile] = useState(false)
  const [activeBottomTab, setActiveBottomTab] = useState(null)
  const [showSubMenu, setShowSubMenu] = useState(false)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [lastClickedTab, setLastClickedTab] = useState(null)

  // Get current active section from URL
  const getCurrentSection = () => {
    const path = location.pathname
    if (path.includes("/user/dashboard")) return "dashboard"
    if (path.includes("/user/create-report")) return "create-report"
    if (path.includes("/user/report-lost")) return "report-lost"
    if (path.includes("/user/report-found")) return "report-found"
    if (path.includes("/user/my-listings")) return "my-listings"
    if (path.includes("/user/pending-approval")) return "pending-approval"
    if (path.includes("/user/archived-listings")) return "archived-listings"
    if (path.includes("/user/favorite-listings")) return "favorite-listings"
    if (path.includes("/user/messenger")) return "messenger"
    if (path.includes("/user/saved-searches")) return "saved-searches"
    if (path.includes("/user/my-account")) return "my-account"
    if (path.includes("/user/settings")) return "settings"
    if (path.includes("/user/notifications")) return "notifications"
    return "dashboard" // default
  }

  const activeSection = getCurrentSection()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Helper function to determine which parent tab a section belongs to
  const getParentTab = (sectionId) => {
    if (sidebarItems.listings.some((item) => item.id === sectionId)) {
      return "listings"
    }
    if (sidebarItems.account.some((item) => item.id === sectionId)) {
      return "account"
    }
    return null
  }

  const handleSectionClick = (sectionId) => {
    // Handle special actions
    if (sectionId === "logout") {
      // Handle logout logic
      localStorage.removeItem("token") // or however you handle logout
      navigate("/login")
      return
    }

    if (sectionId === "close-account") {
      // Handle account closure logic
      if (window.confirm("Are you sure you want to close your account? This action cannot be undone.")) {
        // Add your account closure logic here
        //console.log("Account closure requested")
      }
      return
    }

    // Navigate to the appropriate route
    const routeMap = {
      dashboard: "/user/dashboard",
      "create-report": "/user/create-report",
      "report-lost": "/user/report-lost",
      "report-found": "/user/report-found",
      "my-listings": "/user/my-listings",
      "pending-approval": "/user/pending-approval",
      "archived-listings": "/user/archived-listings",
      "favorite-listings": "/user/favorite-listings",
      messenger: "/user/messenger",
      "saved-searches": "/user/saved-searches",
      "my-account": "/user/my-account",
      settings: "/user/settings",
      notifications: "/user/notifications",
    }

    const route = routeMap[sectionId] || "/user/dashboard"
    navigate(route)

    // Close mobile menu if open
    setShowSubMenu(false)
    setActiveBottomTab(null)
  }

  const handleBottomTabClick = (tabId) => {
    const currentTime = Date.now()

    if (tabId === "dashboard" || tabId === "create-report") {
      handleSectionClick(tabId)
    } else {
      // Check for double-click (within 300ms)
      if (lastClickedTab === tabId && currentTime - lastClickTime < 300) {
        // Double-click detected - close the submenu
        setShowSubMenu(false)
        setActiveBottomTab(null)
        setLastClickTime(0)
        setLastClickedTab(null)
      } else {
        // Single click or different tab
        if (activeBottomTab === tabId && showSubMenu) {
          // Same tab clicked while submenu is open - close it
          setShowSubMenu(false)
          setActiveBottomTab(null)
        } else {
          // Open submenu for this tab
          setActiveBottomTab(tabId)
          setShowSubMenu(true)
        }
        setLastClickTime(currentTime)
        setLastClickedTab(tabId)
      }
    }
  }

  const closeSubMenu = () => {
    setShowSubMenu(false)
    setActiveBottomTab(null)
  }

  const sidebarItems = {
    main: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      {
        id: "create-report",
        label: "Create Report",
        icon: Plus,
        highlight: true,
      },
    ],
    reports: [
      { id: "report-lost", label: "Report Lost Item", icon: FileText },
      { id: "report-found", label: "Report Found Item", icon: MapPin },
    ],
    listings: [
      { id: "my-listings", label: "My Listings", icon: List, count: 12 },
      {
        id: "pending-approval",
        label: "Pending Approval",
        icon: Clock,
        count: 3,
      },
      {
        id: "archived-listings",
        label: "Archived Listings",
        icon: Archive,
        count: 8,
      },
      {
        id: "favorite-listings",
        label: "Favorite Listings",
        icon: Heart,
        count: 15,
      },
      { id: "messenger", label: "Messenger", icon: MessageCircle, count: 2 },
      { id: "saved-searches", label: "Saved Searches", icon: Search, count: 5 },
    ],
    account: [
      { id: "my-account", label: "My Account", icon: User },
      { id: "settings", label: "Settings", icon: Settings },
      { id: "notifications", label: "Notifications", icon: Bell, count: 7 },
      { id: "logout", label: "Log Out", icon: LogOut },
      {
        id: "close-account",
        label: "Close Account",
        icon: Trash2,
        danger: true,
      },
    ],
  }

  // Bottom navigation items for mobile
  const bottomNavItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "create-report", label: "Create", icon: Plus, highlight: true },
    {
      id: "listings",
      label: "Listings",
      icon: List,
      count: sidebarItems.listings.reduce((sum, item) => sum + (item.count || 0), 0),
    },
    {
      id: "account",
      label: "Account",
      icon: User,
      count: sidebarItems.account.reduce((sum, item) => sum + (item.count || 0), 0),
    },
  ]

  // Helper function to check if a section is active
  const isActive = (sectionId) => {
    return activeSection === sectionId
  }

  const DesktopSidebar = () => (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col sticky top-16 h-[calc(100vh-4rem)] mt-7 mb-2">
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Main Navigation */}
        <div className="mb-6">
          {sidebarItems.main.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionClick(item.id)}
              className={`w-full flex items-center px-4 py-2 rounded-lg text-left transition-all mb-2 text-sm ${
                isActive(item.id)
                  ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md"
                  : item.highlight
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                    : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-4 w-4 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>


        {/* My Listings Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("listings")}
            className="w-full flex items-center justify-between px-4 py-2 text-gray-800 font-semibold text-xs uppercase tracking-wide hover:bg-gray-50 rounded-lg transition-colors"
          >
            <span>My Listings</span>
            {expandedSections.listings ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {expandedSections.listings && (
            <div className="mt-2 space-y-1">
              {sidebarItems.listings.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-left transition-all text-sm ${
                    isActive(item.id)
                      ? "bg-cyan-50 text-cyan-700 border-l-4 border-cyan-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-4 w-4 mr-3" />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{item.count}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* My Account Section */}
        <div>
          <button
            onClick={() => toggleSection("account")}
            className="w-full flex items-center justify-between px-4 py-2 text-gray-800 font-semibold text-xs uppercase tracking-wide hover:bg-gray-50 rounded-lg transition-colors"
          >
            <span>My Account</span>
            {expandedSections.account ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {expandedSections.account && (
            <div className="mt-2 space-y-1">
              {sidebarItems.account.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-left transition-all text-sm ${
                    isActive(item.id)
                      ? "bg-cyan-50 text-cyan-700 border-l-4 border-cyan-500"
                      : item.danger
                        ? "text-red-600 hover:bg-red-50"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-4 w-4 mr-3" />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.id === "notifications" ? "bg-red-100 text-red-700" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const MobileBottomNav = () => (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-gray-700 md:hidden">
        <div className="flex items-center justify-around py-2">
          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleBottomTabClick(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                (isActive(item.id) && (item.id === "dashboard" || item.id === "create-report")) ||
                activeBottomTab === item.id ||
                (getParentTab(activeSection) === item.id)
                  ? "bg-cyan-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="relative">
                <item.icon className={`h-5 w-5 ${item.highlight ? "text-green-400" : ""}`} />
                {item.count && item.count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.count > 99 ? "99+" : item.count}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub Menu Modal */}
      {showSubMenu && (
        <>
          {/* Sub Menu */}
          <div className="fixed bottom-20 left-4 right-4 z-50 bg-gray-800 rounded-xl shadow-2xl max-h-96">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-300">
                {activeBottomTab === "listings" ? "My Listings" : "My Account"}
              </h3>
              <button onClick={closeSubMenu} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="p-2">
              {(activeBottomTab === "listings" ? sidebarItems.listings : sidebarItems.account).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all text-sm mb-1 ${
                    isActive(item.id)
                      ? "bg-cyan-600 text-white"
                      : item.danger
                        ? "text-red-400 hover:bg-red-900/20"
                        : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-4 w-4 mr-3" />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.id === "notifications" ? "bg-red-500 text-white" : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Bottom padding to prevent content from being hidden behind bottom nav */}
      <div className="h-20 md:hidden" />
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav />}
    </>
  )
}

export default UserSidebar
