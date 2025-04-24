// src/components/chat/message-input.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSend: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
}

export function MessageInput({ onSend, onTyping }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isTypingTimeout, setIsTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTyping = () => {
    onTyping(true);
    
    // Clear previous timeout
    if (isTypingTimeout) {
      clearTimeout(isTypingTimeout);
    }
    
    // Set a new timeout
    const timeout = setTimeout(() => {
      onTyping(false);
    }, 1000);
    
    setIsTypingTimeout(timeout);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    handleTyping();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      onSend(message);
      setMessage("");
      
      // Clear typing indicator
      if (isTypingTimeout) {
        clearTimeout(isTypingTimeout);
      }
      onTyping(false);
      
      // Focus back on textarea
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-3">
      <div className="flex items-end gap-2">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 flex-shrink-0"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-10 max-h-32 resize-none"
          rows={1}
        />
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 flex-shrink-0"
        >
          <Smile className="h-5 w-5" />
        </Button>
        <Button 
          type="submit" 
          size="icon" 
          className="h-9 w-9 flex-shrink-0"
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}