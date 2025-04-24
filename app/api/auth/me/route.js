// app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { authGuard } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await authGuard(request);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Not authenticated' 
      }, { status: 401 });
    }
    
    await connectToDatabase();
    
    const dbUser = await User.findById(user.id).select('-password');
    
    if (!dbUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      user: dbUser,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to get user info', 
      error: error.message 
    }, { status: 500 });
  }
}