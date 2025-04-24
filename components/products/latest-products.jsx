"use client";

import { useState, useEffect } from 'react';
import ProductCard from './product-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=8&sortBy=createdAt&sortOrder=desc');
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch latest products');
        }
        
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching latest products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {loading ? (
        // Skeleton loading
        Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-4" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))
      ) : (
        // Actual products
        products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))
      )}
    </div>
  );
}