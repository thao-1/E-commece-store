import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Send, FileText, Paperclip } from 'lucide-react';
import io from 'socket.io-client';

export default function ChatInterface({ vendorId, productId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [product, setProduct] = useState(null);
  
  const router = useRouter();
  const { toast } = useToast();
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize connection and fetch messages
  useEffect(() => {
    if (!vendorId) return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get or create chat session
        const response = await fetch('/api/chat/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vendorId, productId })
        });
        
        if (!response.ok) {
          throw new Error('Failed to initialize chat');
        }
        
        const data = await response.json();
        setChatId(data.chatId);
        
        // Fetch vendor and product info if available
        if (vendorId) {
          const vendorRes = await fetch(`/api/vendors/${vendorId}`);
          if (vendorRes.ok) {
            const vendorData = await vendorRes.json();
            setVendor(vendorData);
          }
        }
        
        if (productId) {
          const productRes = await fetch(`/api/products/${productId}`);
          if (productRes.ok) {
            const productData = await productRes.json();
            setProduct(productData);
          }
        }
        
        // Fetch previous messages
        const messagesRes = await fetch(`/api/chat/${data.chatId}/messages`);
        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          setMessages(messagesData);
        }
        
        // Setup socket connection
        const socketInstance = io();
        socketInstance.emit('join_chat', data.chatId);
        
        socketInstance.on('message', (message) => {
          setMessages(prev => [...prev, message]);
        });
        
        setSocket(socketInstance);
        setIsLoading(false);
        
        return () => {
          socketInstance.disconnect();
        };
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [vendorId, productId, toast]);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket || !chatId) return;
    
    try {
      // Send message to server
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          content: newMessage,
          productId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // Emit message to socket
      const data = await response.json();
      socket.emit('send_message', data.message);
      
      setNewMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={vendor?.avatar || "/images/placeholder.png"} alt={vendor?.name} />
            <AvatarFallback>
              {vendor?.name?.charAt(0) || 'V'}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{vendor?.name || 'Vendor'}</CardTitle>
            {product && (
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <FileText className="h-4 w-4 mr-1" />
                <span>Discussing: {product.name}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-4 space-y-4 h-96">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-400">
            <p>Start the conversation with the vendor</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.isFromVendor ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isFromVendor
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-orange-500 text-white'
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <form onSubmit={sendMessage} className="flex w-full space-x-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="flex-shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit" className="flex-shrink-0 bg-orange-500 hover:bg-orange-600">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}