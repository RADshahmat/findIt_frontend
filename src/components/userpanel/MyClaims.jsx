import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Trash2,
  MapPin,
  Calendar,
  Eye,
  AlertCircle,
  Clock,
  Filter,
  Search,
} from "lucide-react";
import { fetchMyClaims, deleteClaim } from "../../features/claim/claimSlice";
import EditReportModal from "./modals/my_reports/EditReportModal";
import DeleteConfirmModal from "./modals/my_reports/DeleteConfirmModal";
import Chat from "./Messenger";


const MyClaims = () => {
  const dispatch = useDispatch();

  const { myClaims, loading } = useSelector((state) => state.claims);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, title
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPostId, setChatPostId] = useState(null);
  const [chatPostOwnerId, setChatPostOwnerId] = useState(null);
  useEffect(() => {
    dispatch(fetchMyClaims());
  }, [dispatch]);

  const handleDelete = (report) => {
    setSelectedReport(report);
    setShowDeleteModal(true);
  };

console.log("myClaims data:", myClaims);

  const confirmDelete = async () => {
    if (selectedReport) {
      console.log("Deleting claim with ID:", selectedReport);
      dispatch(deleteClaim(selectedReport)).unwrap()
        .then(() => {
          dispatch(fetchMyClaims());
        })
        .catch((err) => {
          console.error("Error:", err);
        });;
      setShowDeleteModal(false);
      setSelectedReport(null);
    }
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

  // Filter and sort reports
  const filteredReports = myClaims
    ?.filter((report) => {

      const matchesSearch =
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
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

  const getclaimStatusColor = (claimStatus) => {
    switch (claimStatus) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "under_review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

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
            Loading your My Claims...
          </span>
        </div>
      </div>
    );
  }
  console.log("Rendering MyReports with myClaims:", myClaims);
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
          {/* Title and Search */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
              My Claims
            </h1>

            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search into your claims..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">


            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">By Title</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reports List */}
      {filteredReports?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 sm:p-12 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Reports Found
          </h3>

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
              <div className="p-4 sm:p-6">
                {/* Mobile Layout */}
                <div className="block lg:hidden">
                  <div className="space-y-4">
                    {/* Image and Status */}
                    <div className="relative">
                      <img
                        src={
                          report.image ||
                          report.images?.[0] ||
                          "/placeholder.svg?height=200&width=400"
                        }
                        alt={report.title}
                        className="w-full h-48 object-cover rounded-lg"
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
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {report.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {report.description}
                      </p>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
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
                        <div className={`px-3 py-1 rounded-full text-xs font-medium text-center ${getclaimStatusColor(report.claimStatus)}`}>
                          {report.claimStatus.replace("_", " ").toUpperCase()}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        {/* Edit/Delete buttons */}
                        <div className="flex space-x-2">
                          {report.claimStatus === "approved" && (
                            <button
                              onClick={() => {
                                setChatPostId(report.foundPostId);
                                setChatPostOwnerId(report.postedById);
                                setIsChatOpen(true);
                              }}
                              className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                            >
                              <Mail className="h-4 w-4" />
                              Chat Now
                            </button>
                          )}
                          <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => handleDelete(report.id)}
                            className="flex-1 flex items-center justify-center px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-red-200 dark:border-red-800"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel Claim
                          </motion.button>
                        </div>
                      </div>

                      {/* Created date */}
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          Claimed on {formatDate(report.createdAt || report.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block">
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
                              <span className="truncate">
                                {report.location}
                              </span>
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
                            <div className={`flex px-3 py-1 text-center mx-auto rounded-full text-xs font-medium items-center  ${getclaimStatusColor(report.claimStatus)}`}>
                              {report.claimStatus.replace("_", " ").toUpperCase()}
                            </div>
                          </div>

                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              Claimed on{" "}
                              {formatDate(report.createdAt || report.date)}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-center items-center ml-4 gap-4">

                          {/* Right: Edit/Delete buttons */}
                          <div className="flex space-x-2 pt-1">
                            {report.claimStatus === "approved" && (
                              <button
                                onClick={() => {
                                  setChatPostId(report.foundPostId);
                                  setChatPostOwnerId(report.postedById);
                                  setIsChatOpen(true);
                                }}
                                className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                              >
                                <Mail className="h-4 w-4" />
                                Chat Now
                              </button>
                            )}
                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => handleDelete(report.id)}
                              className="flex-1 flex items-center justify-center px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-red-200 dark:border-red-800"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancel Claim
                            </motion.button>
                          </div>
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

        {isChatOpen && (

          <Chat
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            postId={chatPostId}
            postOwnerId={chatPostOwnerId}
          />

        )}
      </AnimatePresence>
    </div>
  );
};

export default MyClaims;
