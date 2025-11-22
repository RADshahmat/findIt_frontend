import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../axios/axiosInstance";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  MainContainer,
} from "@chatscope/chat-ui-kit-react";

function SupportChat({ apiUrl, sessionToken }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatRef = useRef(null);

  const handleToggleChat = () => {
    setIsChatOpen((prev) => !prev);
    if (!isChatOpen) {
      fetchMessages();
      markMessagesAsRead();
    }
  };

  // Fetch messages from the backend
  const fetchMessages = async () => {
    try {
      const { data } = await axiosInstance.get(`/support_chat`);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  // Fetch unread message count
  const fetchUnreadCount = async () => {
    try {
      const { data } = await axiosInstance.get(`/support_chat/unread-count`);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error fetching unread count", error);
    }
  };
//sending message
  const handleSendMessage = async (text) => {
    try {
      const messagePayload = { message: text, sender: "user" };
      const { data } = await axiosInstance.post(`/support_chat`, messagePayload);
      //console.log('received message',data)
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await axiosInstance.put(`/support_chat/mark-read`);
      setUnreadCount(0); 
    } catch (error) {
      console.error("Error marking messages as read", error);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, []);
  useEffect(() => {
    const fetchUnreadCountAndMessages = () => {
      fetchUnreadCount();
      if (unreadCount && isChatOpen > 0) {
        fetchMessages();
        markMessagesAsRead();
      }
    };
  
    fetchUnreadCountAndMessages(); 
    const interval = setInterval(fetchUnreadCountAndMessages, 25000);
  
    return () => clearInterval(interval);
  }, [unreadCount]);
  
  return (
    <div>
      {/* Support Button */}
      <div
        onClick={handleToggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "rgba(11, 185, 199, 0.8)",
          borderRadius: "50%",
          width: "70px",
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        <img src="/assets/support.png" style={{ width: "70px" }} />
        {!isChatOpen && unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
            }}
          >
            {unreadCount}
          </span>
        )}
      </div>
        
      {/* Chat Window */}
      {isChatOpen && (
          <div
          ref={chatRef}
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "300px",
            height: "400px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden", // Ensures the header stays within bounds
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header Section */}
          <div
            style={{
              backgroundColor: "rgba(11, 185, 199, 0.9)",
              color: "white",
              padding: "10px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "16px",
              borderBottom: "1px solid #ddd",
            }}
          >
            Support Chat
          </div>
          <MainContainer style={{ flexGrow: 1 }}>
            <ChatContainer>
              <MessageList>
                {messages.map((msg, index) => (
                  <Message
                    key={index}
                    model={{
                      message: msg.message,
                      sentTime: msg.created_at,
                      sender: msg.sender,
                      direction: msg.sender !== "admin" ? "outgoing" : "incoming",
                    }}
                  />
                ))}
              </MessageList>
              <MessageInput
                placeholder="Type your message here..."
                onSend={handleSendMessage}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      )}
    </div>
  );
}

export default SupportChat;
