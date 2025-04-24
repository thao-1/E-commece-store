import { io, Socket } from 'socket.io-client';

// Define message type
export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  roomId: string;
}

// Define user type for typing indicators
export interface User {
  id: string;
  name: string;
}

// Socket.io client singleton
let socket: Socket | null = null;

// Initialize socket connection
export const initializeSocket = async (): Promise<Socket> => {
  if (!socket) {
    // First, initialize the socket server
    await fetch('/api/socket');

    // Get socket path from environment variable or use default
    const socketPath = process.env.NEXT_PUBLIC_SOCKET_IO_PATH || '/api/socket/io';

    // Then connect to it
    socket = io({
      path: socketPath,
      addTrailingSlash: false,
    });

    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
  }

  return socket;
};

// Get the socket instance (initializing if needed)
export const getSocket = async (): Promise<Socket> => {
  if (!socket) {
    return await initializeSocket();
  }
  return socket;
};

// Join a chat room
export const joinRoom = async (roomId: string): Promise<void> => {
  const socket = await getSocket();
  socket.emit('join-room', roomId);
};

// Leave a chat room
export const leaveRoom = async (roomId: string): Promise<void> => {
  const socket = await getSocket();
  socket.emit('leave-room', roomId);
};

// Send a message
export const sendMessage = async (roomId: string, message: Message): Promise<void> => {
  const socket = await getSocket();
  socket.emit('send-message', { roomId, message });
};

// Set up message listener
export const onNewMessage = async (callback: (message: Message) => void): Promise<() => void> => {
  const socket = await getSocket();

  socket.on('receive-message', callback);

  // Return cleanup function
  return () => {
    socket?.off('receive-message', callback);
  };
};

// Send typing indicator
export const sendTypingIndicator = async (roomId: string, user: User): Promise<void> => {
  const socket = await getSocket();
  socket.emit('typing', { roomId, user });
};

// Send stop typing indicator
export const sendStopTypingIndicator = async (roomId: string, user: User): Promise<void> => {
  const socket = await getSocket();
  socket.emit('stop-typing', { roomId, user });
};

// Set up typing indicator listener
export const onUserTyping = async (callback: (user: User) => void): Promise<() => void> => {
  const socket = await getSocket();

  socket.on('user-typing', callback);

  // Return cleanup function
  return () => {
    socket?.off('user-typing', callback);
  };
};

// Set up stop typing indicator listener
export const onUserStopTyping = async (callback: (user: User) => void): Promise<() => void> => {
  const socket = await getSocket();

  socket.on('user-stop-typing', callback);

  // Return cleanup function
  return () => {
    socket?.off('user-stop-typing', callback);
  };
};

// Disconnect socket
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
