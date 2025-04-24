"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { initializeSocket, getSocket } from "@/lib/socket";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";

// Message type definition
export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  timestamp: Date;
  isRead: boolean;
}

// Chat interface props
interface ChatInterfaceProps {
  chatId: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
}

export function ChatInterface({
  chatId,
  receiverId,
  receiverName,
  receiverAvatar,
  currentUserId,
  currentUserName,
  currentUserAvatar,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  // Initialize socket connection
  useEffect(() => {
    const setupSocket = async () => {
      try {
        // Get socket path from environment variable
        const socketPath = process.env.NEXT_PUBLIC_SOCKET_IO_PATH || '/api/socket/io';
        console.log(`Initializing socket with path: ${socketPath}`);

        // Initialize socket
        const socket = await initializeSocket();

        setIsConnected(true);
        console.log("Connected to socket with ID:", socket.id);

        // Join the chat room
        socket.emit("join-room", chatId);

        // Mock: Fetch previous messages
        // In a real app, you would fetch these from your API
        const mockMessages: Message[] = [
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
        ];

        setMessages(mockMessages);

        // Handle receiving messages
        socket.on("receive-message", (message: any) => {
          console.log("Received message:", message);

          const formattedMessage: Message = {
            id: message.id || uuidv4(),
            content: message.content,
            sender: {
              id: message.sender?.id || message.senderId,
              name: message.sender?.name || message.senderName,
              avatarUrl: message.sender?.avatarUrl,
            },
            timestamp: new Date(message.timestamp || Date.now()),
            isRead: message.isRead || false,
          };

          setMessages((prevMessages: Message[]) => [...prevMessages, formattedMessage]);
        });

        // Handle typing indicator
        socket.on("user-typing", (user: any) => {
          if (user.id === receiverId) {
            setIsTyping(true);

            // Auto-reset typing indicator after 3 seconds
            setTimeout(() => {
              setIsTyping(false);
            }, 3000);
          }
        });

        socket.on("user-stop-typing", (user: any) => {
          if (user.id === receiverId) {
            setIsTyping(false);
          }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
          setIsConnected(false);
          console.log("Disconnected from socket");
        });
      } catch (error) {
        console.error("Failed to initialize socket:", error);
      }
    };

    setupSocket();

    // Cleanup on unmount
    return () => {
      const cleanup = async () => {
        try {
          const socket = await getSocket();
          socket.emit("leave-room", chatId);
          socket.off("receive-message");
          socket.off("user-typing");
          socket.off("user-stop-typing");
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      };

      cleanup();
    };
  }, [chatId, receiverId, receiverName, receiverAvatar, currentUserId, currentUserName, currentUserAvatar]);

  // Send a message
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      const newMessage: Message = {
        id: uuidv4(),
        content,
        sender: {
          id: currentUserId,
          name: currentUserName,
          avatarUrl: currentUserAvatar,
        },
        timestamp: new Date(),
        isRead: false,
      };

      // Optimistically add the message to the state
      setMessages((prevMessages: Message[]) => [...prevMessages, newMessage]);

      // Send the message through socket
      const socket = await getSocket();
      socket.emit("send-message", {
        roomId: chatId,
        message: {
          id: newMessage.id,
          content: newMessage.content,
          senderId: newMessage.sender.id,
          senderName: newMessage.sender.name,
          timestamp: newMessage.timestamp.getTime(),
          roomId: chatId,
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle typing indicator
  const handleTyping = async (isTyping: boolean) => {
    try {
      const socket = await getSocket();

      if (isTyping) {
        socket.emit("typing", {
          roomId: chatId,
          user: {
            id: currentUserId,
            name: currentUserName,
          },
        });
      } else {
        socket.emit("stop-typing", {
          roomId: chatId,
          user: {
            id: currentUserId,
            name: currentUserName,
          },
        });
      }
    } catch (error) {
      console.error("Error with typing indicator:", error);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Chat Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1 rounded-full hover:bg-gray-100"
              onClick={() => router.back()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
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
  );
}