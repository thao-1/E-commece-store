import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth-client';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // In a real app, you would validate the credentials against your database
    // This is just a mock implementation
    if (email === 'user@example.com' && password === 'password') {
      // Create a user object
      const user = {
        id: '1',
        name: 'John Doe',
        email: email,
        role: 'customer',
      };

      // Generate a JWT token
      const token = signToken(user);

      // Return the user and token
      return NextResponse.json({
        success: true,
        user,
        token,
      });
    } else {
      // Return an error for invalid credentials
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}