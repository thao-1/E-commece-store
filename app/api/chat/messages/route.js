// app/api/chat/messages/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import { Message, Conversation } from '@/lib/db/models/Message';
import { authGuard } from '@/lib/auth';

// Get messages for a conversation
export async function GET(request) {
  try {
    const user = await authGuard(request);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }
    
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversationId');
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    
    if (!conversationId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Conversation ID is required' 
      }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Check if user is part of the conversation
    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation || !conversation.participants.includes(user.id)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Conversation not found or access denied' 
      }, { status: 404 });
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('senderId', 'name avatar');
    
    // Mark messages as read
    await Message.updateMany(
      { 
        conversationId,
        senderId: { $ne: user.id },
        isRead: false
      },
      { isRead: true }
    );
    
    // Update unread count in conversation
    if (conversation.unreadCount && conversation.unreadCount[user.id]) {
      conversation.unreadCount.set(user.id, 0);
      await conversation.save();
    }
    
    return NextResponse.json({
      success: true,
      messages: messages.reverse(), // Return in chronological order
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to get messages', 
      error: error.message 
    }, { status: 500 });
  }
}

// Send a new message
export async function POST(request) {
  try {
    const user = await authGuard(request);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }
    
    const { conversationId, content } = await request.json();
    
    if (!conversationId || !content) {
      return NextResponse.json({ 
        success: false, 
        message: 'Conversation ID and content are required' 
      }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Check if user is part of the conversation
    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation || !conversation.participants.includes(user.id)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Conversation not found or access denied' 
      }, { status: 404 });
    }
    
    // Create message
    const message = new Message({
      conversationId,
      senderId: user.id,
      content,
    });
    
    await message.save();
    
    // Update conversation
    conversation.lastMessage = content;
    conversation.lastMessageDate = new Date();
    
    // Increment unread count for other participants
    conversation.participants.forEach(participantId => {
      if (participantId.toString() !== user.id) {
        const currentCount = conversation.unreadCount.get(participantId.toString()) || 0;
        conversation.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });
    
    await conversation.save();
    
    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to send message', 
      error: error.message 
    }, { status: 500 });
  }
}