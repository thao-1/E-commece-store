import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextResponse } from 'next/server';
import { Socket } from 'net';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Extended Socket type with server property
interface ExtendedSocket extends Socket {
  server: SocketServer;
}

// Extended NextApiRequest type with socket property
interface ExtendedNextApiRequest extends NextApiRequest {
  socket: ExtendedSocket;
}

// Socket server interface
interface SocketServer extends NetServer {
  io?: ServerIO;
}

export async function GET(req: Request) {
  try {
    // Get the raw Node.js request object
    const reqAsNextApiRequest = req as unknown as ExtendedNextApiRequest;

    if (!reqAsNextApiRequest.socket) {
      return NextResponse.json(
        { error: "Socket server initialization failed" },
        { status: 500 }
      );
    }

    const server: SocketServer = reqAsNextApiRequest.socket.server;

    // If the Socket.IO server is already running, return early
    if (server.io) {
      return NextResponse.json(
        { success: true, message: "Socket server already running" },
        { status: 200 }
      );
    }

    // Get environment variables with fallbacks
    const socketPath = process.env.SOCKET_IO_PATH || '/api/socket/io';
    const corsOrigin = process.env.SOCKET_IO_CORS_ORIGIN || '*';
    const loggingEnabled = process.env.SOCKET_IO_LOGGING_ENABLED === 'true';

    // Initialize the Socket.IO server
    const io = new ServerIO(server, {
      path: socketPath,
      addTrailingSlash: false,
      cors: {
        origin: corsOrigin,
        methods: ['GET', 'POST'],
      },
    });

    // Log configuration if logging is enabled
    if (loggingEnabled) {
      console.log(`Socket.IO server initialized with path: ${socketPath}`);
      console.log(`Socket.IO CORS origin: ${corsOrigin}`);
    }

    // Store the Socket.IO server instance
    server.io = io;

    // Socket event handlers
    io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Join a chat room
      socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
      });

      // Leave a chat room
      socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room: ${roomId}`);
      });

      // Handle new messages
      socket.on('send-message', (data) => {
        const { roomId, message } = data;

        // Broadcast the message to all clients in the room
        io.to(roomId).emit('receive-message', message);
        console.log(`Message sent to room ${roomId}`);
      });

      // Handle typing indicators
      socket.on('typing', (data) => {
        const { roomId, user } = data;

        // Broadcast typing status to other users in the room
        socket.to(roomId).emit('user-typing', user);
      });

      // Handle when user stops typing
      socket.on('stop-typing', (data) => {
        const { roomId, user } = data;

        // Broadcast stop typing status to other users in the room
        socket.to(roomId).emit('user-stop-typing', user);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    return NextResponse.json(
      { success: true, message: "Socket server started" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Socket server error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}