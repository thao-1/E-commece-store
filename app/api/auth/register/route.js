import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password, role = 'buyer' } = await request.json();
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ 
        success: false, 
        message: 'Name, email, and password are required' 
      }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'User with this email already exists' 
      }, { status: 400 });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: ['buyer', 'vendor'].includes(role) ? role : 'buyer',
    });
    
    await user.save();
    
    // Generate JWT
    const token = signToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    
    // Set auth cookie
    setAuthCookie(token);
    
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    }, { status: 500 });
  }
}
