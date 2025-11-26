import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { submitDonationRequest } from "../../../../features/reportToAdmin/donationSlice";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function DonationRequestModal({ report, onClose }) {
  const dispatch = useDispatch();

  const [reason, setReason] = useState("");
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("postId", report.id);
    formData.append("reason", reason);

    images.forEach((img) => formData.append("images", img.file));

    dispatch(submitDonationRequest(formData));
    onClose();
  };
console.log(report,"report in donation modal");
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}   // close on outside click
    >
      <motion.div
        variants={modalVariants}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg shadow-lg relative dark:text-white"
        onClick={(e) => e.stopPropagation()}  // prevent close when clicking inside
      >
        <button
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-5 w-5 text-gray-500 hover:text-red-500" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Request Donation</h2>

        <textarea
          className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800"
          placeholder="Explain why you need a donation..."
          rows="4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="mt-4">
          <label className="block font-medium mb-2">Upload Proof Images</label>
          <input
            type="file"
            multiple
            className="border p-2 rounded-lg w-full"
            onChange={handleImageUpload}
          />
        </div>

        {/* Preview Section */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {images.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img.preview}
                className="w-full h-24 object-cover rounded-lg"
              />

              <button
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Submit Request
        </button>
      </motion.div>
    </motion.div>
  );
}
