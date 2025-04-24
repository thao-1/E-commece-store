"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Check, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TopVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch('/api/vendors?limit=6&sortBy=rating&sortOrder=desc');
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch top vendors');
        }

        setVendors(data.vendors);
      } catch (error) {
        console.error('Error fetching top vendors:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {loading ? (
        // Skeleton loading
        Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
        ))
      ) : (
        // Actual vendor cards
        vendors.map((vendor) => (
          <Link
            href={`/vendor/${vendor._id}`}
            key={vendor._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-40 relative">
              <img
                src={vendor.banner || '/images/default-shop-banner.png'}
                alt={`${vendor.shopName} banner`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center">
                  <img
                    src={vendor.logo || '/images/default-shop-logo.png'}
                    alt={`${vendor.shopName} logo`}
                    className="w-12 h-12 rounded-full border-2 border-white mr-3 object-cover"
                  />
                  <div>
                    <h3 className="text-white font-semibold text-lg">{vendor.shopName}</h3>
                    {vendor.isVerified && (
                      <div className="flex items-center text-green-400 text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {vendor.description}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">
                    {vendor.rating.toFixed(1)} ({vendor.totalRatings})
                  </span>
                </div>

                <div className="flex items-center text-gray-500 text-sm">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{vendor.followers?.length || 0}</span>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}