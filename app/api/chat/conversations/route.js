import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import { Conversation } from '@/lib/db/models/Message';
import { authGuard } from '@/lib/auth';

// Get conversations for current user
export async function GET(request) {
  try {
    const user = await authGuard(request);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }
    
    await connectToDatabase();
    
    const conversations = await Conversation.find({
      participants: user.id
    })
    .sort({ lastMessageDate: -1 })
    .populate('participants', 'name avatar')
    .populate('vendorId', 'shopName logo');
    
    return NextResponse.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to get conversations', 
      error: error.message 
    }, { status: 500 });
  }
}

// Create a new conversation
export async function POST(request) {
  try {
    const user = await authGuard(request);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }
    
    const { recipientId, vendorId, initialMessage } = await request.json();
    
    if (!recipientId || !initialMessage) {
      return NextResponse.json({ 
        success: false, 
        message: 'Recipient ID and initial message are required' 
      }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [user.id, recipientId] },
      vendorId: vendorId || null,
    });
    
    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: [user.id, recipientId],
        vendorId: vendorId || null,
        lastMessage: initialMessage,
        unreadCount: { [recipientId]: 1 },
      });
      
      await conversation.save();
    }
    
    return NextResponse.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create conversation', 
      error: error.message 
    }, { status: 500 });
  }
}