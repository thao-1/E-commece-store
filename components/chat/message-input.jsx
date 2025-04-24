"use client"

import React, { useState, useEffect, useRef } from "react"

export function MessageInput({ onSend, onTyping }) {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef(null)
  
  const handleChange = (e) => {
    setMessage(e.target.value)
    
    // Handle typing indicator
    if (!isTyping) {
      setIsTyping(true)
      onTyping?.(true)
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      onTyping?.(false)
    }, 1000)
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (message.trim()) {
      onSend(message)
      setMessage("")
      
      // Clear typing indicator
      setIsTyping(false)
      onTyping?.(false)
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])
  
  return (
    <form 
      onSubmit={handleSubmit}
      className="border-t p-3 flex items-center gap-2"
    >
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={handleChange}
        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={!message.trim()}
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
  )
}
