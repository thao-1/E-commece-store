// lib/db/models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    min: [0, 'Price cannot be negative'],
  },
  currency: {
    type: String,
    default: 'USD',
  },
  images: [
    {
      type: String,
      required: [true, 'Please provide at least one product image'],
    },
  ],
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
  },
  subcategory: {
    type: String,
  },
  inventory: {
    type: Number,
    required: [true, 'Please provide inventory count'],
    min: [0, 'Inventory cannot be negative'],
  },
  sold: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  specifications: {
    type: Map,
    of: String,
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'out_of_stock', 'discontinued'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update 'updatedAt' on save
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create an index for search functionality
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);