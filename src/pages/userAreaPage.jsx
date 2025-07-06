"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import UserSidebar from "../components/userpanel/userSidebar"
import DashboardHome from "../components/userpanel/DashboardHome"
import CreateReport from "../components/userpanel/CreateReport"
import MyListings from "../components/userpanel/MyListings"
import MyReports from "../components/userpanel/MyReports"
import ArchivedListings from "../components/userpanel/ArchivedListings"
import Messenger from "../components/userpanel/Messenger"
import SavedSearches from "../components/userpanel/SavedSearches"
import MyAccount from "../components/userpanel/MyAccount"
import Notifications from "../components/userpanel/Notifications"
import ReportLostItem from "../components/userpanel/ReportLostItem"
import ReportFoundItem from "../components/userpanel/ReportFoundItem"

const UserPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <div className="flex pt-16">
        <UserSidebar />
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-slate-900">
          <Routes>
            {/* Default redirect to dashboard */}
            <Route path="/" element={<Navigate to="/user/dashboard" replace />} />

            {/* Main routes */}
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/create-report" element={<CreateReport />} />
            <Route path="/report-lost" element={<ReportLostItem />} />
            <Route path="/report-found" element={<ReportFoundItem />} />

            {/* Listings routes */}
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/archived-listings" element={<ArchivedListings />} />

            {/* Communication routes */}
            <Route path="/messenger" element={<Messenger />} />
            <Route path="/saved-searches" element={<SavedSearches />} />

            {/* Account routes */}
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default UserPage
