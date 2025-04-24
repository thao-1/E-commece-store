"use client"

import React, { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"
// Mock socket functions for now
const initializeSocket = async () => {
  console.log("Mock socket initialized");
  return { id: "mock-socket-id" };
};

const getSocket = () => {
  return {
    emit: (event, data) => {
      console.log(`Mock socket emitting ${event}:`, data);
    }
  };
};

const joinRoom = (roomId) => {
  console.log(`Mock joining room: ${roomId}`);
};

const leaveRoom = (roomId) => {
  console.log(`Mock leaving room: ${roomId}`);
};

const sendSocketMessage = (roomId, message) => {
  console.log(`Mock sending message to ${roomId}:`, message);
};

export function ChatInterface({
  chatId,
  receiverId,
  receiverName,
  receiverAvatar,
  currentUserId,
  currentUserName,
  currentUserAvatar,
}) {
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    // Mock data - in a real app, fetch from API
    const mockMessages = [
      {
        id: uuidv4(),
        content: "Hello! How can I help you today?",
        sender: {
          id: receiverId,
          name: receiverName,
          avatarUrl: receiverAvatar,
        },
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        isRead: true,
      },
      {
        id: uuidv4(),
        content: "I have a question about my recent order.",
        sender: {
          id: currentUserId,
          name: currentUserName,
          avatarUrl: currentUserAvatar,
        },
        timestamp: new Date(Date.now() - 3500000), // 58 minutes ago
        isRead: true,
      },
      {
        id: uuidv4(),
        content: "Sure, I'd be happy to help. What's your order number?",
        sender: {
          id: receiverId,
          name: receiverName,
          avatarUrl: receiverAvatar,
        },
        timestamp: new Date(Date.now() - 3400000), // 56 minutes ago
        isRead: true,
      },
    ]

    setMessages(mockMessages)

    // Simulate typing indicator
    const typingInterval = setInterval(() => {
      setIsTyping(prev => !prev)
      setTimeout(() => setIsTyping(false), 3000)
    }, 15000)

    return () => clearInterval(typingInterval)
  }, [chatId, receiverId, receiverName, receiverAvatar, currentUserId, currentUserName, currentUserAvatar])

  const sendMessage = (content) => {
    if (!content.trim()) return

    const newMessage = {
      id: uuidv4(),
      content,
      sender: {
        id: currentUserId,
        name: currentUserName,
        avatarUrl: currentUserAvatar,
      },
      timestamp: new Date(),
      isRead: false,
    }

    setMessages(prev => [...prev, newMessage])

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replyMessage = {
        id: uuidv4(),
        content: "Thanks for your message! I'll get back to you shortly.",
        sender: {
          id: receiverId,
          name: receiverName,
          avatarUrl: receiverAvatar,
        },
        timestamp: new Date(),
        isRead: false,
      }

      setMessages(prev => [...prev, replyMessage])
    }, 2000)
  }

  const handleTyping = (isTyping) => {
    // In a real app, emit typing event to server
    console.log(`User ${currentUserId} is ${isTyping ? 'typing' : 'not typing'}`)
  }

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Chat Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {receiverAvatar ? (
                <img src={receiverAvatar} alt={receiverName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-semibold">{receiverName.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="font-medium">{receiverName}</h3>
              <p className="text-xs text-gray-500">
                {isConnected ? "Online" : "Offline"}
                {isTyping && " • Typing..."}
              </p>
            </div>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-0 overflow-hidden flex flex-col">
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
        />
        <MessageInput
          onSend={sendMessage}
          onTyping={handleTyping}
        />
      </div>
    </div>
  )
}
