import { Server } from 'socket.io';
import { verifyToken } from './auth-client';

export default function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication token is required'));
    }

    const user = verifyToken(token);

    if (!user) {
      return next(new Error('Invalid authentication token'));
    }

    // Store user data in socket
    socket.user = user;
    next();
  });

  const userSockets = new Map(); // Map user IDs to their socket IDs

  io.on('connection', (socket) => {
    const userId = socket.user.id;

    // Store user socket
    userSockets.set(userId, socket.id);

    console.log(`User connected: ${userId}`);

    // Join user to their private channel
    socket.join(`user:${userId}`);

    // Handle chat messages
    socket.on('send_message', async (data) => {
      const { conversationId, message } = data;

      // Emit to all users in the conversation
      io.to(`conversation:${conversationId}`).emit('new_message', {
        conversationId,
        message,
      });
    });

    // Join a conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${userId} joined conversation ${conversationId}`);
    });

    // Leave a conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${userId} left conversation ${conversationId}`);
    });

    // Handle inventory updates
    socket.on('inventory_update', (data) => {
      const { productId, inventory } = data;

      // Broadcast to all clients
      io.emit('product_inventory_update', {
        productId,
        inventory,
      });
    });

    // Handle order status updates
    socket.on('order_update', (data) => {
      const { orderId, status, customerId } = data;

      // Emit to specific customer
      const customerSocketId = userSockets.get(customerId);

      if (customerSocketId) {
        io.to(customerSocketId).emit('order_status_update', {
          orderId,
          status,
        });
      }

      // Also emit to user's private channel
      io.to(`user:${customerId}`).emit('order_status_update', {
        orderId,
        status,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      userSockets.delete(userId);
      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
}