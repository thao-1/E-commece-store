"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/lib/socket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Get avatar color based on user ID
  const getAvatarColor = (userId: string) => {
    if (userId === "system") return "bg-gray-500";
    
    // Generate a consistent color based on user ID
    const hash = userId.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 80%)`;
  };
  
  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId;
          const isSystem = message.senderId === "system";
          
          return (
            <div 
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {isSystem ? (
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-gray-800">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</p>
                </div>
              ) : (
                <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${message.senderId}`} />
                    <AvatarFallback style={{ backgroundColor: getAvatarColor(message.senderId) }}>
                      {getInitials(message.senderName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div 
                    className={`rounded-lg p-3 max-w-[80%] ${
                      isCurrentUser 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {!isCurrentUser && (
                      <p className="text-xs font-medium mb-1">
                        {message.senderName}
                      </p>
                    )}
                    <p>{message.content}</p>
                    <p 
                      className={`text-xs mt-1 ${
                        isCurrentUser ? 'text-orange-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
