// MessengerModal.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const MessengerModal = ({ isOpen, onClose, selectedUser }) => {
  const [currentMessages, setCurrentMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentMessages([]);
      setNewMessage("");
    }
  }, [isOpen, selectedUser]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      text: newMessage,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setCurrentMessages([...currentMessages, msg]);
    setNewMessage("");

    setTimeout(() => {
      messagesContainerRef.current?.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e) => setNewMessage(e.target.value);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg h-full max-h-[600px] flex flex-col overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedUser?.name || "User"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedUser?.status || "online"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800"
            >
              {currentMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center mt-16">
                  <div className="text-7xl mb-2 text-blue-500 dark:text-blue-400">
                    {selectedUser?.name?.charAt(0)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Start a conversation with {selectedUser?.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Send a message to get the conversation started!
                  </p>
                </div>
              ) : (
                currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex flex-col max-w-[280px] ${msg.sender === "me" ? "items-end" : "items-start"}`}>
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-sm ${
                          msg.sender === "me"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                            : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border dark:border-gray-600 rounded-bl-md"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={newMessage}
                  onChange={handleTextareaChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows={1}
                  className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl focus:outline-none resize-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-blue-600 text-white rounded-2xl disabled:opacity-50 transition-shadow hover:shadow-lg"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessengerModal;
