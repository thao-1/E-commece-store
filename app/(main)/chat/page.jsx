"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("id");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  // Mock user data - in a real app, get from authentication
  const user = {
    id: "user1",
    name: "John Doe",
    image: "/images/users/john-doe.jpg",
  };

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockChats = [
      {
        id: "chat1",
        user: {
          id: "vendor1",
          name: "Tech Store",
          avatar: "/images/vendors/tech-store.jpg",
        },
        lastMessage: {
          content: "Thank you for your order. It has been shipped.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
        unreadCount: 1,
      },
      {
        id: "chat2",
        user: {
          id: "vendor2",
          name: "Fashion Boutique",
          avatar: "/images/vendors/fashion-boutique.jpg",
        },
        lastMessage: {
          content: "Your item is on its way!",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        },
        unreadCount: 0,
      },
      {
        id: "chat3",
        user: {
          id: "vendor3",
          name: "Home Goods",
          avatar: "/images/vendors/home-goods.jpg",
        },
        lastMessage: {
          content: "Is there anything else you would like to know about the product?",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
        unreadCount: 0,
      },
    ];

    setChats(mockChats);
    setLoading(false);

    // If chatId is provided in URL, select that chat
    if (chatId) {
      const chat = mockChats.find(c => c.id === chatId);
      if (chat) {
        setSelectedChat(chat);

        // Load mock messages for this chat
        const mockMessages = [
          {
            id: "msg1",
            content: "Hello! How can I help you today?",
            sender: {
              id: chat.user.id,
              name: chat.user.name,
              avatarUrl: chat.user.avatar,
            },
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            isRead: true,
          },
          {
            id: "msg2",
            content: "I have a question about my recent order.",
            sender: {
              id: user.id,
              name: user.name,
              avatarUrl: user.image,
            },
            timestamp: new Date(Date.now() - 3500000), // 58 minutes ago
            isRead: true,
          },
          {
            id: "msg3",
            content: "Sure, I'd be happy to help. What's your order number?",
            sender: {
              id: chat.user.id,
              name: chat.user.name,
              avatarUrl: chat.user.avatar,
            },
            timestamp: new Date(Date.now() - 3400000), // 56 minutes ago
            isRead: true,
          },
        ];

        setMessages(mockMessages);
      }
    }
  }, [chatId, user.id, user.name, user.image]);

  // For mobile view toggle
  const [showList, setShowList] = useState(!chatId);

  useEffect(() => {
    // Handle responsive layout
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowList(true);
      } else {
        setShowList(!selectedChat);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [selectedChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: `msg${messages.length + 1}`,
      content: newMessage,
      sender: {
        id: user.id,
        name: user.name,
        avatarUrl: user.image,
      },
      timestamp: new Date(),
      isRead: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate reply after 1 second
    setTimeout(() => {
      const replyMessage = {
        id: `msg${messages.length + 2}`,
        content: "Thanks for your message! I'll get back to you shortly.",
        sender: {
          id: selectedChat.user.id,
          name: selectedChat.user.name,
          avatarUrl: selectedChat.user.avatar,
        },
        timestamp: new Date(),
        isRead: false,
      };

      setMessages(prev => [...prev, replyMessage]);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      <div className="grid md:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List */}
        {(showList || !selectedChat) && (
          <div className="md:col-span-4 lg:col-span-3">
            <div className="h-full border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="p-4 border-b">
                <h2 className="font-bold">Conversations</h2>
                <p className="text-sm text-gray-500">Your active conversations with vendors</p>
              </div>

              <div className="overflow-auto h-[calc(100vh-300px)]">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${
                      selectedChat?.id === chat.id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setSelectedChat(chat);
                      if (window.innerWidth < 768) {
                        setShowList(false);
                      }
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {chat.user.avatar ? (
                        <img src={chat.user.avatar} alt={chat.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-semibold">{chat.user.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{chat.user.name}</h3>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage.content}
                      </p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Interface */}
        <div className="md:col-span-8 lg:col-span-9">
          {selectedChat ? (
            <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white shadow-sm">
              {/* Chat Header */}
              <div className="border-b px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      className="md:hidden p-1 rounded-full hover:bg-gray-100"
                      onClick={() => setShowList(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                      </svg>
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {selectedChat.user.avatar ? (
                        <img src={selectedChat.user.avatar} alt={selectedChat.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-semibold">{selectedChat.user.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{selectedChat.user.name}</h3>
                      <p className="text-xs text-gray-500">
                        Online
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
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                  const isCurrentUser = message.sender.id === user.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg px-4 py-2 ${
                          isCurrentUser
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm break-words">{message.content}</span>
                          <span className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t p-3 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 text-white p-2 rounded-full disabled:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </form>
            </div>
          ) : (
            <div className="h-full border rounded-lg overflow-hidden bg-white shadow-sm flex items-center justify-center p-8">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Select a conversation</h2>
                <p className="text-gray-500">
                  Choose a conversation from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
