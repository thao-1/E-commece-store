"use client";

export default function ChatPageClient() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="grid md:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="h-full border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="p-4 border-b">
              <h2 className="font-bold">Conversations</h2>
              <p className="text-sm text-gray-500">Your active conversations with vendors</p>
            </div>
            
            <div className="overflow-auto h-[calc(100vh-300px)]">
              <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 bg-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <span className="text-lg font-semibold">T</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Tech Store</h3>
                    <span className="text-xs text-gray-500">
                      2 hours ago
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    Thank you for your order. It has been shipped.
                  </p>
                </div>
                <div className="bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  1
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <span className="text-lg font-semibold">F</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Fashion Boutique</h3>
                    <span className="text-xs text-gray-500">
                      1 day ago
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    Your item is on its way!
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <span className="text-lg font-semibold">H</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Home Goods</h3>
                    <span className="text-xs text-gray-500">
                      3 days ago
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    Is there anything else you would like to know about the product?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat Interface */}
        <div className="md:col-span-8 lg:col-span-9">
          <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white shadow-sm">
            {/* Chat Header */}
            <div className="border-b px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    className="md:hidden p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-lg font-semibold">T</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Tech Store</h3>
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
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800 rounded-bl-none">
                  <div className="flex flex-col">
                    <span className="text-sm break-words">Hello! How can I help you today?</span>
                    <span className="text-xs mt-1 text-gray-500">1 hour ago</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="max-w-[75%] rounded-lg px-4 py-2 bg-blue-500 text-white rounded-br-none">
                  <div className="flex flex-col">
                    <span className="text-sm break-words">I have a question about my recent order.</span>
                    <span className="text-xs mt-1 text-blue-100">58 minutes ago</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800 rounded-bl-none">
                  <div className="flex flex-col">
                    <span className="text-sm break-words">Sure, I'd be happy to help. What's your order number?</span>
                    <span className="text-xs mt-1 text-gray-500">56 minutes ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Message Input */}
            <form className="border-t p-3 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
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
        </div>
      </div>
    </div>
  );
}
