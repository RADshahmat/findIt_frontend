import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { X, MapPin, Tag, Award, AlertCircle, Calendar, FileText } from 'lucide-react';
import {
  fetchMatchedLostPost,
  clearMatchedLostPost,
} from "../../../features/posts/getsinglepostSlice";

const MatchedLostPostModal = ({ matchedPostId, onClose }) => {
  const dispatch = useDispatch();
  const { post, loading, error } = useSelector(
    (state) => state.singlepost || {}
  );

  useEffect(() => {
    if (matchedPostId) dispatch(fetchMatchedLostPost(matchedPostId));
    return () => dispatch(clearMatchedLostPost());
  }, [matchedPostId, dispatch]);

  if (!matchedPostId) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-6 py-8 flex justify-between items-start gap-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">
              {post?.title || "Matched Lost Post"}
            </h2>
            <div className="flex gap-2 flex-wrap">
              {post?.categoryName && (
                <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.categoryName}
                </span>
              )}
              {post?.subcategoryName && (
                <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.subcategoryName}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Loading & Error */}
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Images Gallery */}
          {post?.imageUrls && post.imageUrls.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">
                Images
              </label>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {post.imageUrls.map((img, idx) => (
                  <img
                    key={idx}
                    src={img || "/placeholder.svg"}
                    alt={`${post.title} ${idx + 1}`}
                    className="h-48 w-auto object-cover rounded-lg flex-shrink-0 shadow-md hover:shadow-lg transition-shadow"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              Description
            </label>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {post?.description || "No description provided"}
            </p>
          </div>

          {/* Location Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <label className="block text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-3">
              <MapPin className="inline h-4 w-4 mr-1" />
              Location Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide font-semibold mb-1">
                  District
                </p>
                <p className="text-slate-900 dark:text-white font-medium">
                  {post?.location || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide font-semibold mb-1">
                  Specific Location
                </p>
                <p className="text-slate-900 dark:text-white font-medium">
                  {post?.specificLocation || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Reward & Urgency Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {post?.reward > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <label className="block text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide mb-2">
                  <Award className="inline h-4 w-4 mr-1" />
                  Reward
                </label>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  Rs {post.reward.toLocaleString()}
                </p>
              </div>
            )}
            {post?.urgency && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <label className="block text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-2">
                  <AlertCircle className="inline h-4 w-4 mr-1" />
                  Urgency
                </label>
                <p className="text-lg font-bold text-orange-700 dark:text-orange-400">
                  {post.urgency.charAt(0).toUpperCase() + post.urgency.slice(1)}
                </p>
              </div>
            )}
          </div>

          {/* Additional Details */}
          {post?.additionalDetails && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                Additional Details
              </label>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {post.additionalDetails}
              </p>
            </div>
          )}

          {/* Meta Information */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">
              <Calendar className="inline h-4 w-4 mr-1" />
              Post Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Status</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {post?.status || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Created</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Updated</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {post?.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MatchedLostPostModal;
