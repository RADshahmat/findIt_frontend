import React, { useState, useEffect, useCallback } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import io from "socket.io-client";
import axiosInstance from "../../axios/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch,useSelector } from "react-redux";

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export default function Chat() {
  const dispatch = useDispatch();
  const {user,userAdded} = useSelector((state) => state.auth);
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(user.user?.id || null);
  const [isTyping, setIsTyping] = useState(false);
  const [offset, setOffset] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mySocketId, setMySocketId] = useState("");
  const [selectedPeerSocketId, setSelectedPeerSocketId] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  console.log("User ID in Messenger:",user,userId);
  useEffect(() => {
    const newSocket = io("https://backend.butterfly.hurairaconsultancy.com", {
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on("registerSocket", (data) => setMySocketId(data.socketId));
    newSocket.on("activeUsers", (activeUserIds) => setActiveUsers(activeUserIds));

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket && userId) socket.emit("registerUserId", { userId });
  }, [socket, userId]);

  useEffect(() => {
    axiosInstance
      .get(`/chats?socId=${mySocketId}`)
      .then((res) => {
        setChats(res.data);
        setLastMessage(res.data.map((chat) => ({ id: chat.id, lastMessage: chat.lastMessage })));
      })
      .catch(() => {});

    if (socket) {
      socket.on("newMessage", (messageData) => {
        if (selectedChat?.peerId && messageData.userId === selectedChat.peerId) {
          setMessages((prev) => [...prev, messageData]);
        }
        setTimeout(() => scrollToBottom(), 50);
      });

      return () => socket.off("newMessage");
    }
  }, [selectedChat, socket]);

  useEffect(() => {
    if (selectedChat && socket) {
      socket.on("peerTyping", (data) => {
        if (data?.data?.userId === selectedChat.peerId) setIsTyping(data.isTyping);
      });
      return () => socket.off("peerTyping");
    }
  }, [selectedChat, socket]);

  const handleChatClick = async (chat) => {
    setSelectedChat(chat);
    setShowSidebar(false);

    try {
      const response = await axiosInstance.get(`/messages/${chat.peerId}?limit=20&offset=0`);
      setMessages(response.data.messages);
      setPeerId(chat.peerId);
      setOffset(20);
      setHasMore(true);
      setSelectedPeerSocketId(chat.peerSocketId);
      setTimeout(() => scrollToBottom(), 0);
    } catch {}
  };

  const scrollToBottom = () => {
    const chatBody = document.querySelector(".chat-body-tailwind");
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      userId,
      peerId: selectedChat.peerId,
      message: newMessage,
      peerSocketId: selectedPeerSocketId,
    };

    axiosInstance
      .post("/messages", messageData)
      .then(() => {
        socket.emit("newMessage", messageData, userId);
        setMessages((prev) => [...prev, { sender_id: userId, message: newMessage }]);
        setNewMessage("");
        setTimeout(scrollToBottom, 50);
      })
      .catch(() => toast.error("Do not send contact info"));
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${showSidebar ? "translate-x-0" : "-translate-x-full"} 
          fixed md:relative z-50 w-72 bg-white shadow-lg h-full p-4 transition-transform duration-300`}
      >
        <div className="flex items-center mb-4">
          <Link to="/userDashboard" className="text-gray-700 text-xl mr-3">
            <FaArrowLeft />
          </Link>
          <h3 className="text-xl font-semibold">Chats</h3>
        </div>

        <ul>
          {chats.map((chat, i) => (
            <li
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              className="flex items-center p-3 border-b hover:bg-gray-100 cursor-pointer relative"
            >
              <img
                src={chat.image?.[0]?.path ? `https://backend.butterfly.hurairaconsultancy.com/${chat.image[0].path}` : `https://via.placeholder.com/40`}
                className="w-12 h-12 rounded-full mr-3"
              />

              <div className="flex-1">
                <div className="font-semibold text-gray-900 flex items-center">
                  {chat.name}
                </div>
                <div className="text-sm text-gray-500 truncate w-48">
                  {lastMessage[i]?.lastMessage}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex flex-col flex-1 h-full">
        {!selectedChat ? (
          <div className="flex flex-1 items-center justify-center text-gray-400 text-lg">
            Select a chat to start messaging.
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-900 text-white shadow">
              <div className="flex items-center space-x-3">
                <button
                  className="md:hidden text-2xl"
                  onClick={() => setShowSidebar(true)}
                >
                  <FaArrowLeft />
                </button>
                <div className="text-xl font-semibold">{selectedChat.name}</div>
              </div>
              <button onClick={openModal} className="text-2xl">⋮</button>
            </div>

            {/* Messages */}
            <div className="chat-body-tailwind flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start max-w-xs p-3 rounded-2xl shadow 
                    ${msg.sender_id == userId ? "ml-auto bg-blue-600 text-white" : "bg-white text-gray-800"}`}
                >
                  <p>{msg.message}</p>
                </div>
              ))}

              {isTyping && (
                <div className="bg-gray-200 text-gray-600 p-2 rounded-xl w-max">Typing...</div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white shadow flex items-center space-x-3">
              <input
                type="text"
                value={newMessage}
                placeholder="Type a message..."
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-3 border rounded-xl focus:ring focus:ring-blue-300 outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-5 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
