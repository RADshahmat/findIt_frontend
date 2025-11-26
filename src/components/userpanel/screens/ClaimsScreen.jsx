// ClaimsScreen.jsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowLeft,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  FileText,
  Star,
  Shield,
  Eye,
  Link as LinkIcon,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchClaimsByFoundPost,
  approveClaimThunk,
  rejectClaimThunk,
} from "../../../features/claim/claimSlice";

import VerificationResultModal from "../modals/verificationResultModal";
import MatchedLostPostModal from "../modals/MatchedLostPostModal";
import { useParams, useNavigate } from "react-router-dom";
import Chat from "../Messenger";

const getStatusColor = (status) => {
  switch (status) {
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

const getVerificationColor = (score) => {
  if (score >= 90) return "text-green-600 dark:text-green-400";
  if (score >= 70) return "text-blue-600 dark:text-blue-400";
  if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

const ClaimsScreen = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const claimList = useSelector((state) => state.claims.claims) || [];
  const { user } = useSelector((state) => state.auth);

  const [expanded, setExpanded] = useState(null);
  const [modalClaim, setModalClaim] = useState(null);
  const [showModal, setViewLostModal] = useState(false);
  const [chatUser, setChatUser] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPostId, setChatPostId] = useState(null);

  useEffect(() => {
    if (reportId) {
      dispatch(fetchClaimsByFoundPost(reportId));
    }
  }, [reportId, dispatch]);

  const handleApprove = async (claimId) => {
    try {
      await dispatch(approveClaimThunk(claimId)).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (claimId) => {
    try {
      await dispatch(rejectClaimThunk(claimId)).unwrap();
    } catch (err) {
      console.error(err);
    }
  };
  const handleOpenChat = (claimer, postId) => {
    setChatUser(claimer);
    setChatPostId(postId);
    setIsChatOpen(true);
  };

  console.log("Claims List:", claimList);
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 p-6 mb-8">
          <button
            onClick={() => navigate("/user/my-reports")}
            className="p-2 bg-white/80 dark:bg-slate-800 rounded-xl shadow-sm"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700 dark:text-slate-200" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Claims
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {(claimList || []).length} people have claimed this item
            </p>
          </div>
        </div>

        {/* accordion */}
        <div className="space-y-4">
          {claimList.map((claim) => {
            const isOpen = expanded === claim._id;
            //console.log("Rendering claim:", claim._id);
            return (
              <div
                key={claim._id}
                className="bg-white/90 dark:bg-slate-800/80 rounded-2xl shadow-md border border-white/10 overflow-hidden"
              >
                {/* header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : claim._id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {claim.claimer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          {claim.claimer.name}
                        </h3>
                        <div className="text-xs text-slate-500 dark:text-slate-300 flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          {claim.claimer.rating}
                          {claim.claimer.verified && (
                            <Shield className="h-3 w-3 text-green-400 ml-2" />
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(claim.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        claim.status
                      )}`}
                    >
                      {claim.status.replace("_", " ").toUpperCase()}
                    </div>
                    {claim.verdict !== "" && (
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          <span
                            className={`${getVerificationColor(
                              claim.scorePercentage
                            )}`}
                          >
                            {claim.scorePercentage}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* expanded content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 pb-4 pt-0"
                    >
                      <div className="grid md:grid-cols-3 gap-4">
                        {/* left col: evidence */}
                        <div className="md:col-span-2 space-y-3">
                          <div className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-1">
                              Claim Description
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {claim.description}
                            </p>
                          </div>

                          {/* Q&A preview (show few) */}
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="mb-2">
                              {claim.verdict !== "" ? (
                                <div className="space-y-1">
                                  <div className="text-xs text-green-700 dark:text-green-300 font-semibold">
                                    AI VERDICT
                                  </div>

                                  <div className="text-lg font-bold text-green-900 dark:text-green-100">
                                    {claim.verdict}
                                  </div>

                                  <div
                                    className={`text-sm mt-1 ${getVerificationColor(
                                      claim.scorePercentage
                                    )}`}
                                  >
                                    Confidence Score: {claim.scorePercentage}%
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-600 dark:text-gray-300 italic">
                                  Direct Claim — No AI Verification
                                </div>
                              )}
                            </div>
                          </div>

                          {/* proof files preview */}
                          <div className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-2">
                              Proof Documents
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {claim.proofFiles.map((f, i) => (
                                <div
                                  key={i}
                                  className="w-24 h-24 border rounded-lg overflow-hidden relative bg-white/60"
                                >
                                  <img
                                    src={`https://backend.finditbd.hurairaconsultancy.com${f.url}`}
                                    alt={f.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <a
                                    href={`https://backend.finditbd.hurairaconsultancy.com${f.url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="absolute bottom-1 right-1 bg-white/80 dark:bg-slate-800/70 rounded px-1 py-0.5 text-xs"
                                  >
                                    Open
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* right col: meta & actions */}
                        <div className="space-y-3">
                          <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                Contact
                              </div>
                              {/* <div className="text-xs text-slate-500 dark:text-slate-400">{claim.location}</div> */}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {claim.claimer.phone}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Mail className="h-4 w-4" />
                                {claim.claimer.email}
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-white/10">
                            <div className="flex flex-col gap-2">
                              {claim.verdict !== "" && (
                                <button
                                  onClick={() => setModalClaim(claim)}
                                  className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Verification Details
                                </button>
                              )}
                              {claim.matchedLostPostId !== "" &&
                                claim.matchedLostPostId !== null && (
                                  <button
                                    onClick={() =>
                                      setViewLostModal(claim.matchedLostPostId)
                                    }
                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg text-sm border"
                                  >
                                    <LinkIcon className="h-4 w-4" />
                                    View Matched Lost Post
                                  </button>
                                )}
                              {claim.status === "pending" && (
                                <div className="flex gap-3 mt-3 justify-between">
                                  <button
                                    onClick={() => handleApprove(claim._id)}
                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Approve
                                  </button>

                                  <button
                                    onClick={() => handleReject(claim._id)}
                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                  </button>
                                </div>
                              )}

                              {claim.status === "approved" && (
                                <button
                                  onClick={() =>
                                    handleOpenChat(
                                      claim.claimerId,
                                      claim.foundPostId
                                    )
                                  }
                                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                                >
                                  <Mail className="h-4 w-4" />
                                  Chat Now
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification Modal */}
      <AnimatePresence>
        {modalClaim && (
          <VerificationResultModal
            claim={modalClaim}
            onClose={() => setModalClaim(null)}
          />
        )}

        {showModal && (
          <MatchedLostPostModal
            matchedPostId={showModal}
            onClose={() => setViewLostModal(false)}
          />
        )}

        {isChatOpen && chatUser && (
          <Chat
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            postId={chatPostId}
            postOwnerId={chatUser}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClaimsScreen;
