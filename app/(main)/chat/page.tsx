"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ChatInterface } from "@/components/chat/chat-interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface ChatPreview {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    timestamp: Date;
  };
  unreadCount: number;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("id");
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockChats: ChatPreview[] = [
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
      }
    }
  }, [chatId]);

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

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="p-10 text-center">
            <h2 className="text-xl font-bold mb-2">Please log in</h2>
            <p>You need to be logged in to access the chat feature.</p>
          </CardContent>
        </Card>
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
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
                <CardDescription>Your active conversations with vendors</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="all">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="m-0">
                    <ScrollArea className="h-[calc(100vh-300px)]">
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
                          <Avatar>
                            <AvatarImage src={chat.user.avatar} />
                            <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
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
                            <div className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                              {chat.unreadCount}
                            </div>
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="unread" className="m-0">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      {chats
                        .filter((chat) => chat.unreadCount > 0)
                        .map((chat) => (
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
                            <Avatar>
                              <AvatarImage src={chat.user.avatar} />
                              <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
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
                              <div className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                                {chat.unreadCount}
                              </div>
                            )}
                          </div>
                        ))}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Chat Interface */}
        <div className="md:col-span-8 lg:col-span-9">
          {selectedChat ? (
            <ChatInterface
              chatId={selectedChat.id}
              receiverId={selectedChat.user.id}
              receiverName={selectedChat.user.name}
              receiverAvatar={selectedChat.user.avatar}
              currentUserId={user.id}
              currentUserName={user.name}
              currentUserAvatar={user.image}
            />
          ) : (
            <Card className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Select a conversation</h2>
                <p className="text-gray-500">
                  Choose a conversation from the list to start chatting
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}