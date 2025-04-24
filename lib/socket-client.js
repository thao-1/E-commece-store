"use client"

import { io } from 'socket.io-client';
import { getCurrentUserClient } from './auth-client';

let socket = null;

export const initializeSocket = async () => {
  if (!socket) {
    // First, initialize the socket server
    await fetch('/api/socket');
    
    // Get the current user
    const user = getCurrentUserClient();
    
    // Then connect to it
    socket = io({
      path: process.env.NEXT_PUBLIC_SOCKET_IO_PATH || '/api/socket/io',
      auth: {
        token: user ? user.token : null,
      },
      autoConnect: true,
    });
    
    // Set up event listeners
    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket.id);
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
  }
  
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket first.');
  }
  
  return socket;
};

export const joinRoom = (roomId) => {
  const socket = getSocket();
  socket.emit('join_conversation', roomId);
};

export const leaveRoom = (roomId) => {
  const socket = getSocket();
  socket.emit('leave_conversation', roomId);
};

export const sendMessage = (roomId, message) => {
  const socket = getSocket();
  socket.emit('send_message', {
    conversationId: roomId,
    message,
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
