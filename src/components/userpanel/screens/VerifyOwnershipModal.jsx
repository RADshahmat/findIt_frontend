"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { generateQnA, verifyQnA } from "../../../features/verification/verificationSlice";

const VerifyOwnershipModal = ({ isOpen, onClose, postId }) => {
  const dispatch = useDispatch();
  const { generatedQuestions, loading } = useSelector((s) => s.verification);

  const [answers, setAnswers] = useState([]);

  // Fetch questions when opened
  useEffect(() => {
    if (isOpen && postId) {
      dispatch(generateQnA(postId));
      console.log("Generating questions for postId:", postId);
    }
  }, [isOpen, postId, dispatch]);

  // Reset answer fields when questions arrive
  useEffect(() => {
    if (generatedQuestions?.length > 0) {
      setAnswers(Array(generatedQuestions.length).fill(""));
    }
  }, [generatedQuestions]);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(verifyQnA({ postId, userAnswers: answers }));
    alert("Verification submitted!");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <motion.div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-2xl relative">
            <button onClick={onClose} className="absolute right-4 top-4">
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">Verify Item Ownership</h2>

            {loading && <p className="text-center py-4">Loading Questions...</p>}

            {!loading && generatedQuestions?.length > 0 && (
              <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto">
                {generatedQuestions.map((q, index) => (
                  <div key={q._id || index}>
                    <label className="block mb-1 font-medium">{q}</label>
                    <input
                      type="text"
                      required
                      value={answers[index] || ""}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white py-2 px-6 rounded-lg flex items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />} Submit
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerifyOwnershipModal;
