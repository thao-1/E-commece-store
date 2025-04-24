import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Order from '@/lib/db/models/Order';
import Product from '@/lib/db/models/Product';
import { authGuard } from '@/lib/auth';

// Get orders for current user
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
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const status = url.searchParams.get('status');
    
    await connectToDatabase();
    
    // Build filter
    const filter = { userId: user.id };
    
    if (status) {
      filter.status = status;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments(filter);
    
    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to get orders', 
      error: error.message 
    }, { status: 500 });
  }
}

// Create a new order
export async function POST(request) {
  try {
    const user = await authGuard(request);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }
    
    const { items, shippingAddress, paymentMethod } = await request.json();
    
    // Validate input
    if (!items || !items.length || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ 
        success: false, 
        message: 'Items, shipping address, and payment method are required' 
      }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Verify products and calculate total
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return NextResponse.json({ 
          success: false, 
          message: `Product ${item.productId} not found` 
        }, { status: 404 });
      }
      
      if (product.inventory < item.quantity) {
        return NextResponse.json({ 
          success: false, 
          message: `Not enough inventory for product ${product.name}` 
        }, { status: 400 });
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        productId: product._id,
        vendorId: product.vendorId,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        image: product.images[0],
      });
      
      // Update inventory
      product.inventory -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }
    
    // Create order
    const order = new Order({
      userId: user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });
    
    await order.save();
    
    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create order', 
      error: error.message 
    }, { status: 500 });
  }
}