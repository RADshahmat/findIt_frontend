"use client"
import { useState, useRef, useEffect } from "react"

import { Send, X, Sun, Moon, Search, MoreVertical, ArrowLeft } from "lucide-react"


const users = [
  { id: 1, name: "Alice Johnson", avatar: "🧑‍🦰", status: "online", lastSeen: "now" },
  { id: 2, name: "Bob Smith", avatar: "👨‍🦱", status: "online", lastSeen: "2m ago" },
  { id: 3, name: "Charlie Brown", avatar: "👨‍🦳", status: "offline", lastSeen: "1h ago" },
  { id: 4, name: "Diana Prince", avatar: "👩‍🦱", status: "away", lastSeen: "5m ago" },
]

const initialMessages = {
  1: [
    { id: 1, sender: "Alice", text: "Hey! How are you doing?", timestamp: "10:30 AM" },
    { id: 2, sender: "me", text: "I'm good! Just working on some projects. How about you?", timestamp: "10:32 AM" },
    {
      id: 3,
      sender: "Alice",
      text: "Same here! Working on the new design system. It's coming along nicely.",
      timestamp: "10:35 AM",
    },
  ],
  2: [
    { id: 1, sender: "me", text: "Hey Bob! Long time no see!", timestamp: "9:15 AM" },
    { id: 2, sender: "Bob", text: "Hey! Yeah, it's been a while. How's everything going?", timestamp: "9:20 AM" },
  ],
  3: [],
  4: [{ id: 1, sender: "Diana", text: "Hi! Are we still on for the meeting tomorrow?", timestamp: "Yesterday" }],
}

const Messenger = () => {
  const [selectedUserId, setSelectedUserId] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("messenger-selectedUserId")
      return saved ? Number.parseInt(saved) : users[0].id
    }
    return users[0].id
  })
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("messenger-sidebarOpen")
      return saved ? JSON.parse(saved) : false
    }
    return false
  })
  const [searchQuery, setSearchQuery] = useState("")
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)


  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedUserId])

  useEffect(() => {
    localStorage.setItem("messenger-selectedUserId", selectedUserId.toString())
  }, [selectedUserId])

  useEffect(() => {
    localStorage.setItem("messenger-sidebarOpen", JSON.stringify(sidebarOpen))
  }, [sidebarOpen])

  const handleSend = () => {
    if (!newMessage.trim()) return

    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), newMsg],
    }))
    setNewMessage("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const currentMessages = messages[selectedUserId] || []
  const selectedUser = users.find((u) => u.id === selectedUserId)

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const handleTextareaChange = (e) => {
    setNewMessage(e.target.value)
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
  }

  return (
    <div className="min-h-screen w-full  overflow-hidden">
    
      <div className="flex">
      
        <div className="flex-1 flex justify-center items-center p-2 sm:p-4 h-[calc(100vh-80px)] pb-28 sm:pb-4" style={{width: "100%"}}>
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(156, 163, 175, 0.5);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(156, 163, 175, 0.7);
            }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(75, 85, 99, 0.5);
            }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(75, 85, 99, 0.7);
            }
            .word-wrap {
              word-wrap: break-word;
              overflow-wrap: anywhere;
              word-break: break-word;
              hyphens: auto;
            }
            .modern-textarea-scroll::-webkit-scrollbar {
              width: 2px;
            }
            .modern-textarea-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .modern-textarea-scroll::-webkit-scrollbar-thumb {
              background: rgba(156, 163, 175, 0.3);
              border-radius: 10px;
            }
            .modern-textarea-scroll::-webkit-scrollbar-thumb:hover {
              background: rgba(156, 163, 175, 0.5);
            }
            .dark .modern-textarea-scroll::-webkit-scrollbar-thumb {
              background: rgba(75, 85, 99, 0.3);
            }
            .dark .modern-textarea-scroll::-webkit-scrollbar-thumb:hover {
              background: rgba(75, 85, 99, 0.5);
            }
            @media (max-width: 768px) {
              .modern-textarea-scroll::-webkit-scrollbar {
                width: 1px;
              }
              .modern-textarea-scroll::-webkit-scrollbar-thumb {
                background: rgba(156, 163, 175, 0.2);
              }
              .dark .modern-textarea-scroll::-webkit-scrollbar-thumb {
                background: rgba(75, 85, 99, 0.2);
              }
            }
          `}</style>
          <div className="w-full max-w-5xl h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden flex border border-white/20 dark:border-gray-700/50 min-w-0">
            {/* Sidebar */}
            <div
              className={`w-full sm:w-80 border-r border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex-shrink-0 flex-col ${sidebarOpen ? "flex" : "hidden"} sm:flex transition-all duration-300 max-w-full`}
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Messages
                  </h2>
                  <div className="flex items-center gap-2">
                    
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="sm:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* User List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredUsers.map((user) => {
                  const lastMessage = messages[user.id]?.[messages[user.id]?.length - 1]
                  return (
                    <div
                      key={user.id}
                      className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 ${
                        user.id === selectedUserId ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500" : ""
                      }`}
                      onClick={() => {
                        setSelectedUserId(user.id)
                        setSidebarOpen(false)
                      }}
                    >
                      <div className="relative">
                        <div className="text-3xl">{user.avatar}</div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(user.status)}`}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate pr-2">{user.name}</h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                            {user.lastSeen}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px] sm:max-w-none">
                          {lastMessage
                            ? (lastMessage.sender === "me" ? "You: " : "") + lastMessage.text
                            : "No messages yet"}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="sm:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <div className="relative">
                      <div className="text-3xl">{selectedUser?.avatar}</div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(selectedUser?.status)}`}
                      ></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedUser?.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{selectedUser?.status}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50"
              >
                {currentMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="text-6xl mb-4">{selectedUser?.avatar}</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Start a conversation with {selectedUser?.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">Send a message to get the conversation started!</p>
                  </div>
                ) : (
                  currentMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`flex flex-col max-w-[280px] sm:max-w-xs lg:max-w-md ${msg.sender === "me" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm word-wrap break-all overflow-wrap-anywhere ${
                            msg.sender === "me"
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                              : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md"
                          }`}
                          style={{ wordBreak: "break-word", overflowWrap: "anywhere", maxWidth: "100%" }}
                        >
                          <p
                            className="text-sm leading-relaxed"
                            style={{ wordBreak: "break-word", overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}
                          >
                            {msg.text}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">{msg.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm pb-safe">
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={newMessage}
                      onChange={handleTextareaChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full p-4 pr-12 bg-gray-100 dark:bg-gray-700 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all text-sm leading-relaxed text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 overflow-y-auto modern-textarea-scroll"
                      style={{
                        minHeight: "52px",
                        maxHeight: "120px",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        whiteSpace: "pre-wrap",
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex-shrink-0 self-end"
                    style={{ height: "52px", width: "52px" }}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messenger
