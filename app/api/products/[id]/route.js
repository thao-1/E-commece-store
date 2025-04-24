// app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/lib/db/models/Product';
import Vendor from '@/lib/db/models/Vendor';
import { authGuard, vendorGuard } from '@/lib/auth';

// Get product by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    await connectToDatabase();

    const product = await Product.findById(id)
      .populate('vendorId', 'shopName logo description rating');

    if (!product) {
      return NextResponse.json({
        success: false,
        message: 'Product not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to get product',
      error: error.message
    }, { status: 500 });
  }
}

// Update product
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
    const updates = await request.json();

    await connectToDatabase();

    // Check if product exists
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({
        success: false,
        message: 'Product not found'
      }, { status: 404 });
    }

    // Get vendor
    const vendor = await Vendor.findOne({ userId: user.id });

    // Verify ownership
    if (product.vendorId.toString() !== vendor._id.toString()) {
      return NextResponse.json({
        success: false,
        message: 'You do not have permission to update this product'
      }, { status: 403 });
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('vendorId', 'shopName logo description rating');

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    }, { status: 500 });
  }
}

// Delete product
export async function DELETE(request, { params }) {
  try {
    const user = await vendorGuard(request);

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Vendor access required'
      }, { status: 403 });
    }

    const { id } = params;

    await connectToDatabase();

    // Check if product exists
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({
        success: false,
        message: 'Product not found'
      }, { status: 404 });
    }

    // Get vendor
    const vendor = await Vendor.findOne({ userId: user.id });

    // Verify ownership
    if (product.vendorId.toString() !== vendor._id.toString()) {
      return NextResponse.json({
        success: false,
        message: 'You do not have permission to delete this product'
      }, { status: 403 });
    }

    // Delete product
    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    }, { status: 500 });
  }
}