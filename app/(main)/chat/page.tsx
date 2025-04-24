"use client";

import { useEffect, useState } from "react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useAuth } from "@/hooks/use-auth"; // Assuming you have an auth hook
import { initializeSocket } from "@/lib/socket";

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth() || { user: null }; // Get current user
  
  // Initialize socket connection when the page loads
  useEffect(() => {
    const setupSocket = async () => {
      try {
        await initializeSocket();
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize socket:", error);
        setIsLoading(false);
      }
    };
    
    setupSocket();
    
    // Cleanup function
    return () => {
      // Socket disconnection is handled in the ChatInterface component
    };
  }, []);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Connecting to chat...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Sign in to access chat</h2>
          <p className="mb-4">You need to be signed in to use the chat feature.</p>
          <button 
            onClick={() => window.location.href = "/auth/login"}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Customer Support Chat</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ChatInterface 
          currentUser={{
            id: user.id,
            name: user.name || user.email,
          }}
          roomId="support-room" // Default room for customer support
        />
      </div>
    </div>
  );
}
