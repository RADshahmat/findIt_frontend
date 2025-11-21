import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaArrowLeft } from "react-icons/fa";
import io from "socket.io-client";
import axiosInstance from "../../axios/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function ChatModal({ isOpen, onClose, postId, postOwnerId }) {
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.user?.id ?? null;
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  const [messages, setMessages] = useState([]); // message objects; each may include: _id, postId, sender_id, receiver_id, message, createdAt, read
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false); // peer typing
  const [activeUsers, setActiveUsers] = useState([]);
  const [localTyping, setLocalTyping] = useState(false);

  // pagination state
  const LIMIT = 20;
  const [offset, setOffset] = useState(0); // how many messages have been loaded
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // post owner info
  const [peerInfo, setPeerInfo] = useState({ name: "User", avatar: null });

  // refs
  const containerRef = useRef(null);
  const stopTypingDebounceRef = useRef(null);

  // debounce helper
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Initialize socket connection when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const sock = io("https://backend.finditbd.hurairaconsultancy.com", {
      withCredentials: true,
    });

    socketRef.current = sock;
    setSocket(sock);

    sock.on("registerSocket", (data) => {
      // console.debug("registerSocket", data);
    });

    sock.on("activeUsers", (activeUserIds) => {
      setActiveUsers(Array.isArray(activeUserIds) ? activeUserIds : []);
    });

    sock.on("newMessage", (messageData) => {
      // only consider messages for this post
      if (!messageData) return;
      if (messageData.postId?.toString() === postId?.toString()) {
        setMessages((prev) => [...prev, markReadFlag(prev, messageData)]);
        // If the incoming message is sent to current user, send read receipt immediately
        if (messageData.receiver_id?.toString() === currentUserId?.toString()) {
          emitReadReceipt([messageData._id || messageData.id || null].filter(Boolean));
        }
        setTimeout(() => scrollToBottom(), 80);
      }
    });

    sock.on("peerTyping", (payload) => {
      const data = payload?.data;
      const typingFlag = !!payload?.isTyping;
      if (data && data.userId && data.userId === postOwnerId) {
        setIsTyping(typingFlag);
      }
    });

    // When someone marks messages read, update local messages (server to sender)
    sock.on("messageRead", (payload) => {
      const { messageIds = [], readerId } = payload || {};
      if (!messageIds || messageIds.length === 0) return;
      setMessages((prev) =>
        prev.map((m) => {
          if (messageIds.includes(m._id || m.id)) return { ...m, read: true };
          return m;
        })
      );
    });

    sock.on("connect", () => {
      if (currentUserId) sock.emit("registerUserId", { userId: currentUserId });
    });

    return () => {
      if (sock) sock.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentUserId, postOwnerId, postId]);

  // Fetch peer info when modal opens or postOwnerId changes
  useEffect(() => {
    if (!isOpen || !postOwnerId) return;

    const fetchPeer = async () => {
      try {
        const res = await axiosInstance.get(`/user/${postOwnerId}`);
        const info = res?.data ?? {};
        // If your API returns nested shape, adjust accordingly.
        console.log("Peer info fetched:", info);
        setPeerInfo({
          name: info.username ?? info.fullName ?? `User ${postOwnerId}`,
          avatar: info.user_image
            ?? info.profilePicture ?? null,
        });
      } catch (err) {
        console.warn("Failed to fetch peer info", err);
        // keep default peer info
      }
    };

    fetchPeer();
  }, [isOpen, postOwnerId]);

  // Load initial messages (page 0)
  useEffect(() => {
    if (!isOpen || !postId) return;
    resetAndLoadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, postId]);

  // register userId on socket when available
  useEffect(() => {
    if (socket && currentUserId) socket.emit("registerUserId", { userId: currentUserId });
  }, [socket, currentUserId]);

  // helper: mark read flag for incoming message if message indicates read
  function markReadFlag(prevMessages, incomingMessage) {
    // preserve read if previously known
    const newMsg = { ...incomingMessage };
    if (incomingMessage.read === undefined) newMsg.read = incomingMessage.receiver_id?.toString() === currentUserId?.toString() ? false : incomingMessage.read ?? false;
    return newMsg;
  }

  // reset pagination and load latest page
  const resetAndLoadInitial = async () => {
    setMessages([]);
    setOffset(0);
    setHasMore(true);
    try {
      const res = await axiosInstance.get(`/messages/${postId}?limit=${LIMIT}&offset=0`);
      const data = res?.data;
      const msgs = Array.isArray(data) ? data : data?.messages ?? data ?? [];
      console.log("Initial messages loaded:", msgs,postId);
      setMessages(msgs);
      setOffset(msgs.length);
      setHasMore(msgs.length === LIMIT);
      // after loading, mark any unread messages for this user as read
      markUnreadMessagesAsRead(msgs);
      setTimeout(() => scrollToBottom(), 80);
    } catch (err) {
      console.error("Failed to load messages", err);
      toast.error("Failed to load messages");
    }
  };

  // load more (older) messages — we expect backend to support offset/limit
  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await axiosInstance.get(`/messages/${postId}?limit=${LIMIT}&offset=${offset}`);
      const data = res?.data;
      const moreMsgs = Array.isArray(data) ? data : data?.messages ?? data ?? [];
      if (!moreMsgs || moreMsgs.length === 0) {
        setHasMore(false);
      } else {
        // Prepend older messages so they appear above
        setMessages((prev) => [...moreMsgs, ...prev]);
        setOffset((prev) => prev + moreMsgs.length);
        setHasMore(moreMsgs.length === LIMIT);
      }
    } catch (err) {
      console.error("load more error", err);
      toast.error("Could not load more messages");
    } finally {
      setLoadingMore(false);
    }
  };

  // scroll to bottom utility
  const scrollToBottom = () => {
    const el = containerRef.current || document.querySelector(".chat-body-tailwind");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  // typing: emit typing and schedule stop
  const emitStartTyping = useCallback(
    debounce(() => {
      if (socket && postOwnerId && currentUserId) {
        socket.emit("typing", { peerId: postOwnerId, userId: currentUserId });
      }
    }, 200),
    [socket, postOwnerId, currentUserId]
  );

  const scheduleStopTyping = useCallback(() => {
    if (stopTypingDebounceRef.current) clearTimeout(stopTypingDebounceRef.current);
    stopTypingDebounceRef.current = setTimeout(() => {
      if (socket && postOwnerId && currentUserId) {
        socket.emit("stopTyping", { peerId: postOwnerId, userId: currentUserId });
      }
      setLocalTyping(false);
    }, 800);
  }, [socket, postOwnerId, currentUserId]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setNewMessage(val);

    if (!localTyping) {
      setLocalTyping(true);
      emitStartTyping();
    } else {
      emitStartTyping();
    }
    scheduleStopTyping();
  };

  // send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!currentUserId) {
      toast.error("Please login to send messages");
      return;
    }

    const payload = {
      postId,
      sender_id: currentUserId,
      receiver_id: postOwnerId,
      message: newMessage.trim(),
      meta: {},
    };

    try {
      const res = await axiosInstance.post("/message", payload);
      // if backend returns created message, use it; otherwise create optimistic message
      const created = res?.data ?? null;
      if (created && (created._id || created.id)) {
        setMessages((prev) => [...prev, created]);
      } else {
        const localMsg = {
          _id: `local-${Date.now()}`,
          postId,
          sender_id: currentUserId,
          receiver_id: postOwnerId,
          message: newMessage.trim(),
          createdAt: new Date().toISOString(),
          read: false,
        };
        setMessages((prev) => [...prev, localMsg]);
      }

      // emit over socket
      if (socket) {
        const socketPayload = {
          postId,
          userId: currentUserId,
          peerId: postOwnerId,
          message: newMessage.trim(),
          sender_id: currentUserId,
          receiver_id: postOwnerId,
          // optionally include message id if backend returned it
          messageId: created?._id || created?.id || null,
        };
        socket.emit("newMessage", socketPayload, currentUserId);
      }

      setNewMessage("");
      // immediate read stop typing
      if (socket) socket.emit("stopTyping", { peerId: postOwnerId, userId: currentUserId });
      setLocalTyping(false);
      setTimeout(() => scrollToBottom(), 80);
    } catch (err) {
      console.error("send message error", err);
      toast.error("Could not send message");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // When modal opens OR when messages change, mark unread messages as read for this user
  const markUnreadMessagesAsRead = (msgs) => {
    if (!Array.isArray(msgs) || !msgs.length) return;
    // find message ids where receiver_id === currentUserId and read !== true
    const unreadIds = msgs
      .filter((m) => m.receiver_id?.toString() === currentUserId?.toString() && !m.read)
      .map((m) => m._id || m.id)
      .filter(Boolean);

    if (unreadIds.length === 0) return;

    // 1) Optimistically update local messages
    setMessages((prev) =>
      prev.map((m) => {
        if ((m._id || m.id) && unreadIds.includes(m._id || m.id)) return { ...m, read: true };
        return m;
      })
    );

    // 2) notify server via socket to inform sender
    emitReadReceipt(unreadIds);

    // 3) optionally post to server to mark as read persistently
    // You can enable this if you add an endpoint like POST /messages/read
    axiosInstance.post("/messages/read", { postId, readerId: currentUserId, messageIds: unreadIds }).catch(() => {
      // ignore if server doesn't support it yet
    });
  };

  // emit read receipt via socket
  const emitReadReceipt = (messageIds = []) => {
    if (!socket || !messageIds || messageIds.length === 0) return;
    const payload = {
      postId,
      readerId: currentUserId,
      messageIds,
    };
    socket.emit("messageRead", payload);
  };

  // On messages change, auto-mark unread messages read
  useEffect(() => {
    if (!isOpen || !messages || messages.length === 0) return;
    // mark unread messages that belong to this post
    markUnreadMessagesAsRead(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isOpen]);

  // scroll/load-more: when user scrolls to top, load older messages
  const handleScroll = (e) => {
    const el = e.target;
    if (!el) return;
    if (el.scrollTop <= 10 && hasMore && !loadingMore) {
      // load more older messages
      loadMore();
    }
  };

  // helper: close modal and cleanup
  const handleClose = () => {
    if (socket && postOwnerId && currentUserId) {
      socket.emit("stopTyping", { peerId: postOwnerId, userId: currentUserId });
    }
    if (stopTypingDebounceRef.current) {
      clearTimeout(stopTypingDebounceRef.current);
      stopTypingDebounceRef.current = null;
    }
    setMessages([]);
    setNewMessage("");
    setOffset(0);
    setHasMore(true);
    setIsTyping(false);
    setLocalTyping(false);
    onClose && onClose();
  };

  const peerIsActive = postOwnerId && activeUsers.includes(postOwnerId);

  if (!isOpen) return null;

  return (
    <>
         <AnimatePresence>
              <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
      
          <motion.div className="relative z-60 w-full max-w-2xl h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-lg flex flex-col overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
            <div className="flex items-center gap-3">
              <img
                src={`https://backend.finditbd.hurairaconsultancy.com/image/${peerInfo.avatar}` || "/default-avatar.png"}
                alt={peerInfo.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <div className="text-lg font-semibold">{peerInfo.name}</div>
                <div className="text-sm">
                  {peerIsActive ? (
                    <span className="text-green-400">Active</span>
                  ) : (
                    <span className="text-gray-400">Offline</span>
                  )}
                  {isTyping && <span className="ml-3 text-yellow-200">Typing...</span>}
                </div>
                </div>
            </div>
            <button
                onClick={handleClose}
                className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
          </div>

          {/* Messages */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="chat-body-tailwind flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
          >
            {hasMore && (
              <div className="flex justify-center mb-2">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-3 py-1 text-sm rounded-full border"
                >
                  {loadingMore ? "Loading..." : "Load more"}
                </button>
              </div>
            )}

            {messages.length === 0 && <div className="text-center text-gray-400 mt-8">No messages yet — say hi 👋</div>}

            {messages.map((msg, i) => {
              const senderId = msg.sender_id ?? msg.userId ?? msg.senderId;
              const isMine = senderId?.toString() === currentUserId?.toString();
              const created = msg.createdAt ?? msg.created_at ?? Date.now();
              const messageId = msg._id || msg.id || `msg-${i}`;

              return (
                <div key={messageId} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow ${isMine ? "bg-blue-600 text-white" : "bg-white text-gray-800"}`}>
                    <div className="text-sm whitespace-pre-wrap">{msg.message}</div>
                    <div className="flex items-center justify-between text-[10px] text-gray-300 mt-1">
                      <span>{new Date(created).toLocaleTimeString()}</span>
                      {isMine && (
                        <span className="ml-2 text-[10px]">
                          {msg.read ? "Read" : "Sent"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-600 p-2 rounded-xl w-max">Typing...</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-white shadow flex items-center gap-3">
            <textarea
              rows={1}
              value={newMessage}
              placeholder="Type a message..."
              onChange={(e) => {
                handleInputChange(e);
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 p-3 border rounded-xl focus:ring focus:ring-blue-300 outline-none resize-none max-h-32"
            />
            <button onClick={handleSendMessage} className="px-5 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">
              Send
            </button>
          </div>
        </motion.div>
      </motion.div>
</AnimatePresence>
      <ToastContainer />
    </>
  );
}
