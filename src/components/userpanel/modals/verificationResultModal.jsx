// src/components/VerificationModal.jsx
import { motion } from "framer-motion";
import { X, CheckCircle, XCircle } from "lucide-react";

const getVerificationColor = (score) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
};

const VerificationResultModal = ({ claim, onClose }) => {
    if (!claim) return null;

    const { questions = [], userAnswers = [] } = claim;

    return (
        <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-2xl shadow-xl p-6 border border-white/10"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Verification Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                        <X className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                    </button>
                </div>

                {/* Verdict */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 mb-6">
                    <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                        AI Verdict
                    </div>
                    <div className="text-lg font-bold text-green-900 dark:text-green-100">
                        {claim.verdict}
                    </div>
                    <div className={`text-sm mt-1 ${getVerificationColor(claim.scorePercentage)}`}>
                        Confidence Score: {claim.scorePercentage}%
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="max-h-[60vh] overflow-y-auto pr-1">
                    <table className="w-full text-sm border-collapse text-slate-800 dark:text-slate-200">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-700 text-left">
                                <th className="p-3 font-semibold">Question</th>
                                <th className="p-3 font-semibold">Correct Answer</th>
                                <th className="p-3 font-semibold">User Answer</th>
                                <th className="p-3 font-semibold text-center">Score</th>
                                <th className="p-3 font-semibold text-center">Match</th>
                            </tr>
                        </thead>

                        <tbody>
                            {questions.map((q, idx) => {
                                const userAnsObj = userAnswers[idx] || {};
                                const userAns = userAnsObj.userAnswer || "—";
                                const score = userAnsObj.score || 0;
                                const isMatch = score >= 50; // Adjust threshold here

                                return (
                                    <tr
                                        key={q._id}
                                        className="border-b border-slate-200 dark:border-slate-700"
                                    >
                                        <td className="p-3 text-slate-800 dark:text-slate-200">
                                            {q.question}
                                        </td>
                                        <td className="p-3 text-green-700 dark:text-green-300">
                                            {q.answer}
                                        </td>
                                        <td className="p-3 text-blue-700 dark:text-blue-300">
                                            {userAns}
                                        </td>
                                        <td className={`p-3 text-center ${getVerificationColor(score)}`}>
                                            {score.toFixed(2)}%
                                        </td>
                                        <td className="p-3 text-center">
                                            {isMatch ? (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            </motion.div>
        </motion.div>
    );
};

export default VerificationResultModal;
