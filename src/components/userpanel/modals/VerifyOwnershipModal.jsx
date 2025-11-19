"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { generateQnA, verifyQnA } from "../../../features/verification/verificationSlice";

const VerifyOwnershipModal = ({ isOpen, onClose, postId , lost_post_id}) => {
  const dispatch = useDispatch();
  const { generatedQuestions, loading } = useSelector((s) => s.verification);

  const [answers, setAnswers] = useState([]);
  const [apiMessage, setApiMessage] = useState("");
  const [proofFiles, setProofFiles] = useState([]); // support multiple files
  const [note, setNote] = useState("");

  // Reset form function
  const resetForm = () => {
    setAnswers([]);
    setProofFiles([]);
    setNote("");
    setApiMessage("");
  };

  useEffect(() => {
    if (isOpen && postId && lost_post_id) {
      //console.log("Generating QnA for FoundpostId:", postId, "and lost_post_id:", lost_post_id);
      dispatch(generateQnA({ postId, lost_post_id })).then((res) => {
        const msg = res.payload?.message;
        if (msg === "You have already submitted verification for this post.") {
          setApiMessage(msg);
        } else {
          setApiMessage("");
        }
      });
    } else if (!isOpen) {
      // Reset form when modal closes
      resetForm();
    }
  }, [isOpen, postId, lost_post_id, dispatch]);

  useEffect(() => {
    if (Array.isArray(generatedQuestions) && generatedQuestions.length > 0) {
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

    const formData = new FormData();
    answers.forEach((ans, idx) => formData.append(`userAnswers[${idx}]`, ans));
    if (note) formData.append("note", note);
    proofFiles.forEach((file) => formData.append("proof_files", file));

    await dispatch(
      verifyQnA({
        postId,
        formData,
      })
    );

    // Reset form after submit
    resetForm();
    onClose();
  };

  // Add file
  const handleAddFile = (e) => {
    const file = e.target.files[0];
    if (file) setProofFiles([...proofFiles, file]);
    e.target.value = null; // allow re-upload same file
  };

  // Remove file
  const handleRemoveFile = (index) => {
    setProofFiles(proofFiles.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex justify-center items-center p-4"
        >
          <motion.div
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 rounded-2xl p-6 w-full max-w-2xl relative shadow-xl border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button
              onClick={() => { resetForm(); onClose(); }}
              className="absolute right-4 top-4 text-slate-600 dark:text-slate-300 hover:text-red-500 transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-semibold mb-4">Verify Item Ownership</h2>

            {loading && (
              <div className="py-6 text-center text-slate-600 dark:text-slate-300">
                Loading Questions...
              </div>
            )}

            {!loading && apiMessage && (
              <p className="text-center py-4 text-slate-700 dark:text-slate-300 font-medium">
                {apiMessage}
              </p>
            )}

            {!loading && !apiMessage && Array.isArray(generatedQuestions) && generatedQuestions.length > 0 && (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"
              >
                {/* QUESTIONS */}
                {generatedQuestions.map((q, index) => (
                  <div key={index} className="space-y-1">
                    <label className="block font-medium text-slate-700 dark:text-slate-300">{q}</label>
                    <input
                      type="text"
                      required
                      value={answers[index] || ""}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
                      placeholder="Write your answer..."
                    />
                  </div>
                ))}

  {/* UPLOAD PROOF */}
                  <div className="space-y-1">
                    <label className="block font-medium text-slate-700 dark:text-slate-300">
                      Upload Proof (optional)
                    </label>
                    <label className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                      <span className="truncate text-slate-600 dark:text-slate-300">
                        {proofFiles.length > 0
                          ? `${proofFiles.length} file(s) selected`
                          : "Choose files..."}
                      </span>
                      <Upload size={20} className="text-slate-600 dark:text-slate-300" />
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        multiple
                        className="hidden"
                        onChange={handleAddFile}
                      />
                    </label>

                    {/* PREVIEW THUMBNAILS */}
                    {proofFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {proofFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="relative w-16 h-16 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden"
                          >
                            {file.type.startsWith("image") ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-slate-200 dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 text-center p-1">
                                {file.name}
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="absolute -top-0 -right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Upload images or PDFs as proof. You can upload multiple files.
                    </p>
                  </div>


                {/* NOTE */}
                <div className="space-y-1">
                  <label className="block font-medium text-slate-700 dark:text-slate-300">Additional Note (optional)</label>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
                    placeholder="Write any extra info..."
                  ></textarea>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium shadow-md"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>
                    <Send size={18} /> Submit Verification
                  </>}
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
