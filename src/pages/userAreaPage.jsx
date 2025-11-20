
import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import UserSidebar from "../components/userpanel/userSidebar"
import DashboardHome from "../components/userpanel/DashboardHome"
import CreateReport from "../components/userpanel/CreateReport"
import MyListings from "../components/userpanel/MyListings"
import MyReports from "../components/userpanel/MyReports"
import ArchivedListings from "../components/userpanel/ArchivedListings"
import Messenger from "../components/userpanel/Messenger"
import MyClaims from "../components/userpanel/MyClaims"
import MyAccount from "../components/userpanel/MyAccount"
import Notifications from "../components/userpanel/Notifications"
import ReportLostItem from "../components/userpanel/ReportLostItem"
import ReportFoundItem from "../components/userpanel/ReportFoundItem"
import MatchedItemsScreen from "../components/userpanel/screens/MatchedItemsScreen"
import ClaimsScreen from "../components/userpanel/screens/ClaimsScreen"

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
            <Route path="/my-reports/matchedscreen/:reportId" element={<MatchedItemsScreen />} />
            <Route path="/my-reports/claimscreen/:reportId" element={<ClaimsScreen />} />
            <Route path="/archived-listings" element={<ArchivedListings />} />

            {/* Communication routes */}
            
            <Route path="/myclaims" element={<MyClaims />} />
            <Route path="/messenger" element={<Messenger />} />

            {/* Account routes */}
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default UserPage
