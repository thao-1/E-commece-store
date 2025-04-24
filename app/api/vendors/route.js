import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Vendor from '@/lib/db/models/Vendor';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    
    await connectToDatabase();
    
    // Build query
    const query = {};
    if (search) {
      query.shopName = { $regex: search, $options: 'i' };
    }
    
    // Get vendors
    const vendors = await Vendor.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const totalVendors = await Vendor.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      vendors,
      pagination: {
        total: totalVendors,
        page,
        limit,
        pages: Math.ceil(totalVendors / limit)
      }
    });
  } catch (error) {
    console.error('Vendors API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch vendors', 
      error: error.message 
    }, { status: 500 });
  }
}
