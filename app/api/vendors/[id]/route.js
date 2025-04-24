import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Vendor from '@/lib/db/models/Vendor';
import Product from '@/lib/db/models/Product';
import { authGuard } from '@/lib/auth';

// Get vendor by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    await connectToDatabase();
    
    const vendor = await Vendor.findById(id)
      .lean();
    
    if (!vendor) {
      return NextResponse.json({ 
        success: false, 
        message: 'Vendor not found' 
      }, { status: 404 });
    }
    
    // Get product count
    const productCount = await Product.countDocuments({ vendorId: id });
    
    return NextResponse.json({
      success: true,
      vendor: {
        ...vendor,
        productCount
      }
    });
  } catch (error) {
    console.error('Get vendor error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to get vendor', 
      error: error.message 
    }, { status: 500 });
  }
}
