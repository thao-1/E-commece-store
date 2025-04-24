import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Order from '@/lib/db/models/Order';
import { authGuard, vendorGuard } from '@/lib/auth';

// Get order by ID
export async function GET(request, { params }) {
  try {
    const user = await authGuard(request);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }
    
    const { id } = params;
    
    await connectToDatabase();
    
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order not found' 
      }, { status: 404 });
    }
    
    // Check if user is authorized to view this order
    const isOwner = order.userId.toString() === user.id;
    const isVendor = user.role === 'vendor' && order.items.some(item => 
      item.vendorId.toString() === user.vendorId
    );
    const isAdmin = user.role === 'admin';
    
    if (!isOwner && !isVendor && !isAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: 'Not authorized to view this order' 
      }, { status: 403 });
    }
    
    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to get order', 
      error: error.message 
    }, { status: 500 });
  }
}

// Update order status
export async function PUT(request, { params }) {
  try {
    const user = await vendorGuard(request);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Vendor access required' 
      }, { status: 403 });
    }
    
    const { id } = params;
    const { status, trackingInfo } = await request.json();
    
    await connectToDatabase();
    
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order not found' 
      }, { status: 404 });
    }
    
    // Check if vendor has items in this order
    const hasItems = order.items.some(item => 
      item.vendorId.toString() === user.vendorId
    );
    
    if (!hasItems && user.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        message: 'Not authorized to update this order' 
      }, { status: 403 });
    }
    
    // Update order
    if (status) {
      order.status = status;
    }
    
    if (trackingInfo) {
      order.trackingInfo = {
        ...order.trackingInfo,
        ...trackingInfo,
      };
    }
    
    await order.save();
    
    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update order', 
      error: error.message 
    }, { status: 500 });
  }
}