import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function GET() {
  try {
    removeAuthCookie();
    
    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Logout failed', 
      error: error.message 
    }, { status: 500 });
  }
}