"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export default function ProductCard({ product }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  
  const {
    _id,
    name,
    price,
    originalPrice,
    images,
    rating,
    totalRatings,
    vendorId,
    inventory,
  } = product;
  
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  
  const addToCart = () => {
    if (inventory <= 0) {
      toast({
        title: "Out of stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }
    
    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => item.productId === _id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if already in cart
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      cart.push({
        productId: _id,
        name,
        price,
        image: images[0],
        quantity: 1,
        vendorId: vendorId._id || vendorId,
        vendorName: vendorId.shopName || 'Vendor',
        maxQuantity: inventory,
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update other tabs
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    });
  };
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
    
    if (!isLiked) {
      toast({
        title: "Added to wishlist",
        description: `${name} has been added to your wishlist.`,
      });
    } else {
      toast({
        title: "Removed from wishlist",
        description: `${name} has been removed from your wishlist.`,
      });
    }
  };
  
  return (
    <div 
      className="relative group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
          {discount}% OFF
        </div>
      )}
      
      {/* Wishlist button */}
      <button
        onClick={toggleLike}
        className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md z-10 transition-all duration-300 hover:bg-gray-100"
      >
        <Heart 
          className={cn(
            "h-4 w-4 transition-colors", 
            isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
          )} 
        />
      </button>
      
      {/* Product image */}
      <Link href={`/products/${_id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={images[0] || '/images/product-placeholder.png'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      
      {/* Product details */}
      <div className="p-4">
        {/* Vendor */}
        {vendorId && (
          <Link href={`/vendors/${typeof vendorId === 'object' ? vendorId._id : vendorId}`}>
            <p className="text-xs text-gray-500 mb-1">
              {typeof vendorId === 'object' ? vendorId.shopName : 'Vendor'}
            </p>
          </Link>
        )}
        
        {/* Product name */}
        <Link href={`/products/${_id}`}>
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-orange-500 transition-colors">
            {name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
          </div>
          <span className="mx-1.5 text-xs text-gray-500">·</span>
          <span className="text-xs text-gray-500">{totalRatings} reviews</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center mb-3">
          <span className="text-lg font-bold text-gray-900">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Inventory indicator */}
        {inventory <= 5 && inventory > 0 && (
          <p className="text-xs text-orange-600 mb-2">
            Only {inventory} left in stock
          </p>
        )}
        {inventory <= 0 && (
          <p className="text-xs text-red-600 mb-2">
            Out of stock
          </p>
        )}
        
        {/* Add to cart button */}
        <div className={cn(
          "transform transition-all duration-300",
          isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          <Button 
            onClick={addToCart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2"
            disabled={inventory <= 0}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}