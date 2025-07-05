"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Trash2,
  MapPin,
  Calendar,
  Eye,
  AlertCircle,
  Clock,
  Filter,
  Search,
  Users,
  MessageSquare,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import {
  fetchUserReports,
  deleteReport,
  demoReports,
} from "../../features/reports/reportsSlice";
import EditReportModal from "./modals/my_reports/EditReportModal";
import DeleteConfirmModal from "./modals/my_reports/DeleteConfirmModal";
import MatchedItemsScreen from "./screens/MatchedItemsScreen";
import ClaimsScreen from "./screens/ClaimsScreen";

const MyReports = () => {
  const dispatch = useDispatch();

  // Demo data - replace with actual Redux state when backend is ready

  const {userReports = demoReports,loading} = useSelector((state) =>state.reports || { userReports: demoReports, loading: false, error: null });

  const [selectedReport, setSelectedReport] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, lost, found
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, title
  const [currentScreen, setCurrentScreen] = useState("reports"); // reports, matched, claims
  const [selectedReportForScreen, setSelectedReportForScreen] = useState(null);

  useEffect(() => {
    dispatch(fetchUserReports());
  }, [dispatch]);

  const handleEdit = (report) => {
    setSelectedReport(report);
    setShowEditModal(true);
  };

  const handleDelete = (report) => {
    setSelectedReport(report);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedReport) {
      await dispatch(deleteReport(selectedReport.id));
      setShowDeleteModal(false);
      setSelectedReport(null);
    }
  };

  const handleMatchedItems = (report) => {
    setSelectedReportForScreen(report);
    setCurrentScreen("matched");
  };

  const handleClaims = (report) => {
    setSelectedReportForScreen(report);
    setCurrentScreen("claims");
  };

  const handleFoundThis = (report) => {
    // Handle marking item as found
    console.log("Marking as found:", report.id);
    // You can dispatch an action to update the report status
  };

  const handleReturnedThis = (report) => {
    // Handle marking item as returned
    console.log("Marking as returned:", report.id);
    // You can dispatch an action to update the report status
  };

  const goBackToReports = () => {
    setCurrentScreen("reports");
    setSelectedReportForScreen(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "lost":
        return "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400";
      case "found":
        return "bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/20 dark:text-green-400";
      case "resolved":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400";
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "critical":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Filter and sort reports
  const filteredReports = userReports
    ?.filter((report) => {
      const matchesType = filterType === "all" || report.status === filterType;
      const matchesSearch =
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    })
    ?.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date)
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "newest":
        default:
          return (
            new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
          );
      }
    });

  // Calculate counts
  const totalReports = userReports.length;
  const lostReports = userReports.filter((r) => r.status === "lost").length;
  const foundReports = userReports.filter((r) => r.status === "found").length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    hover: {
      y: -2,
      scale: 1.01,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
    tap: { scale: 0.95 },
  };

  // Render different screens
  if (currentScreen === "matched") {
    return (
      <MatchedItemsScreen
        report={selectedReportForScreen}
        onBack={goBackToReports}
      />
    );
  }

  if (currentScreen === "claims") {
    return (
      <ClaimsScreen report={selectedReportForScreen} onBack={goBackToReports} />
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full"
          />
          <span className="ml-3 text-gray-600 dark:text-gray-300">
            Loading your reports...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Search */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
              My Reports
            </h1>

            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Item Type Cards */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === "all"
                  ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              All <span className="text-xs ml-1">({totalReports})</span>
            </button>
            <button
              onClick={() => setFilterType("lost")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === "lost"
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Lost <span className="text-xs ml-1">({lostReports})</span>
            </button>
            <button
              onClick={() => setFilterType("found")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === "found"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Found <span className="text-xs ml-1">({foundReports})</span>
            </button>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">By Title</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Reports List */}
      {filteredReports?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Reports Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery || filterType !== "all"
              ? "Try adjusting your search or filter criteria"
              : "You haven't created any reports yet. Start by reporting a lost or found item."}
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filteredReports?.map((report) => (
            <motion.div
              key={report.id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="relative w-40 h-32 flex-shrink-0">
                    <img
                      src={
                        report.image ||
                        report.images?.[0] ||
                        "/placeholder.svg?height=128&width=160"
                      }
                      alt={report.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status.toUpperCase()}
                      </span>
                    </div>
                    {report.urgency && report.status === "lost" && (
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(
                            report.urgency
                          )}`}
                        >
                          {report.urgency.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate">
                          {report.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                          {report.description}
                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{report.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{formatDate(report.date)}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{report.views || 0} views</span>
                          </div>
                          {report.reward > 0 && (
                            <div className="flex items-center text-green-600 dark:text-green-400">
                              <span className="font-medium">
                                ৳ {report.reward.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            Created{" "}
                            {formatDate(report.createdAt || report.date)}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-center items-center ml-4 gap-4">
                        {/* Left: Vertical buttons */}
                        <div className="flex flex-col items-start space-y-2">
                          {/* Status-specific top button */}
                          {report.status === "lost" && (
                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => handleMatchedItems(report)}
                              className="w-full flex items-center px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                            >
                              <Users className="h-4 w-4 mr-2" />
                              10 Matching Found
                            </motion.button>
                          )}
                          {report.status === "found" && (
                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => handleClaims(report)}
                              className="w-full flex justify-center items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />4 Claims
                            </motion.button>
                          )}

                          {/* Resolution button */}
                          {report.status === "lost" && (
                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => handleFoundThis(report)}
                              className="w-full flex justify-center items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />I Found
                              This
                            </motion.button>
                          )}
                          {report.status === "found" && (
                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => handleReturnedThis(report)}
                              className="w-full flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md"
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />I Returned
                              This
                            </motion.button>
                          )}
                        </div>

                        {/* Right: Edit/Delete buttons */}
                        <div className="flex space-x-2 pt-1">
                          <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => handleEdit(report)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit Report"
                          >
                            <Edit3 className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => handleDelete(report)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Report"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showEditModal && (
          <EditReportModal
            report={selectedReport}
            onClose={() => {
              setShowEditModal(false);
              setSelectedReport(null);
            }}
          />
        )}
        {showDeleteModal && (
          <DeleteConfirmModal
            report={selectedReport}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedReport(null);
            }}
            onConfirm={confirmDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyReports;
