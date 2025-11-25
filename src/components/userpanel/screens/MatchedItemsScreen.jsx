"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  MessageCircle,
  CheckCircle,
  Phone,
  Mail,
  Star,

} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMatchess } from "../../../features/matching/matching";
import VerifyOwnershipModal from "../modals/VerifyOwnershipModal";
import { autoCreateClaim } from "../../../features/claim/claimSlice";
import Chat from "../Messenger";

// 🔹 Main Screen Component
const MatchedItemsScreen = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    matches = [],
  } = useSelector(
    (state) => state.matches || { matches: [], loading: false, error: null }
  );

  const [isVerifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPostId, setChatPostId] = useState(null);
  const [chatPostOwnerId, setChatPostOwnerId] = useState(null);


  useEffect(() => {
    if (reportId) {
      dispatch(fetchMatchess(reportId));
    }
  }, [dispatch, reportId]);

  const getMatchColor = (percentage) => {
    if (percentage >= 90)
      return "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400";
    if (percentage >= 80)
      return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400";
    return "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400";
      case "contacted":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400";
      case "verified":
        return "bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/20 dark:text-green-400";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen  p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/user/my-reports")}
              className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Matched Items
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Found {matches.length} potential matches for your lost item
              </p>
            </div>
          </div>
        </motion.div>

        {/* Matched Items Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {matches.map((item, index) => (
            <motion.div
              key={item._id || item.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              {/* Image and Match Percentage */}
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  src={`https://backend.finditbd.hurairaconsultancy.com/image/${item.image[0]}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Match Percentage */}
                <div className="absolute top-3 left-3">
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span
                      className={`text-sm font-bold ${getMatchColor(
                        item.matchPercentage
                      )}`}
                    >
                      {item.matchPercentage}% Match
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                  <span>{item.location}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Calendar className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      Finder
                    </h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        4.5
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    {item.finderName}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Phone className="h-3 w-3 mr-2" />
                      <span>{item.finderPhone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="h-3 w-3 mr-2" />
                      <span>{item.finderEmail}</span>
                    </div>
                  </div>
                </div>


{/* Action Buttons */}
<div className="flex gap-3">

  {/* People category buttons */}
  {item.categoryName === "People" && (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        if (item.myClaimStatus === "approved") {
          // Open chat directly
          setChatPostId(item._id);
          setChatPostOwnerId(item.postedBy);
          setIsChatOpen(true);
        } else {
          // Auto-create claim + then open chat
          dispatch(autoCreateClaim({ postId: item._id, lost_post_id: reportId }))
            .unwrap()
            .then(() => {
              setChatPostId(item._id);
              setChatPostOwnerId(item.postedBy);
              setIsChatOpen(false);
            })
            .catch((e) => console.log("Auto claim failed:", e));
        }
      }}
      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 text-sm font-medium"
    >
      <MessageCircle className="h-4 w-4" />
      <span>{item.myClaimStatus === "approved" ? "Contact" : "Request Contact"}</span>
    </motion.button>
  )}

  {/* Other categories */}
  {item.categoryName !== "People" && (
    <>
      {item.myClaimStatus === "approved" ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setChatPostId(item._id);
            setChatPostOwnerId(item.postedBy);
            setIsChatOpen(true);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 text-sm font-medium"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Contact</span>
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedMatch(item);
            setVerifyModalOpen(true);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm font-medium"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Verify</span>
        </motion.button>
      )}
    </>
  )}
</div>




              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {isChatOpen && (
        <Chat
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          postId={chatPostId}
          postOwnerId={chatPostOwnerId}
        />
      )}
      {/* Verification Modal */}
      <VerifyOwnershipModal
        isOpen={isVerifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        postId={selectedMatch?._id}
        lost_post_id={reportId}
      />
    </motion.div>
  );
};

export default MatchedItemsScreen;
