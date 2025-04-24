import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import Vendor from '@/lib/db/models/Vendor';
import { authGuard } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = await authGuard(request);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }
    
    const { shopName, description, contactEmail, contactPhone, address } = await request.json();
    
    // Validate input
    if (!shopName || !description || !contactEmail) {
      return NextResponse.json({ 
        success: false, 
        message: 'Shop name, description, and contact email are required' 
      }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Check if shop name already exists
    const existingVendor = await Vendor.findOne({ shopName });
    if (existingVendor) {
      return NextResponse.json({ 
        success: false, 
        message: 'Shop name already taken' 
      }, { status: 400 });
    }
    
    // Create vendor
    const vendor = new Vendor({
      userId: user.id,
      shopName,
      description,
      contactEmail,
      contactPhone,
      address,
    });
    
    await vendor.save();
    
    // Update user role to vendor
    await User.findByIdAndUpdate(user.id, { role: 'vendor' });
    
    return NextResponse.json({
      success: true,
      message: 'Vendor registered successfully',
      vendor,
    });
  } catch (error) {
    console.error('Vendor registration error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Vendor registration failed', 
      error: error.message 
    }, { status: 500 });
  }
}