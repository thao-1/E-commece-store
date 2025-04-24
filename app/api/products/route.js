import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/lib/db/models/Product';
import Vendor from '@/lib/db/models/Vendor';
import { authGuard, vendorGuard } from '@/lib/auth';

// Get all products with filters
export async function GET(request) {
  try {
    const url = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const category = url.searchParams.get('category');
    const vendorId = url.searchParams.get('vendorId');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const search = url.searchParams.get('search');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    
    await connectToDatabase();
    
    // Build filter query
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (vendorId) {
      filter.vendorId = vendorId;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Only show active products
    filter.status = 'active';
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('vendorId', 'shopName logo');
    
    const total = await Product.countDocuments(filter);
    
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to get products', 
      error: error.message 
    }, { status: 500 });
  }
}

// Create a new product
export async function POST(request) {
  try {
    const user = await vendorGuard(request);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Vendor access required' 
      }, { status: 403 });
    }
    
    await connectToDatabase();
    
    // Get vendor
    const vendor = await Vendor.findOne({ userId: user.id });
    
    if (!vendor) {
      return NextResponse.json({ 
        success: false, 
        message: 'Vendor not found' 
      }, { status: 404 });
    }
    
    const productData = await request.json();
    
    // Validate required fields
    if (!productData.name || !productData.description || !productData.price || !productData.category || !productData.inventory) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required product fields' 
      }, { status: 400 });
    }
    
    // Create product
    const product = new Product({
      ...productData,
      vendorId: vendor._id,
    });
    
    await product.save();
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create product', 
      error: error.message 
    }, { status: 500 });
  }
}