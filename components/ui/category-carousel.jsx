"use client"

import React from "react"
import Link from "next/link"

const categories = [
  {
    id: "electronics",
    name: "Electronics",
    image: "/images/categories/electronics.jpg",
    description: "Latest gadgets and tech",
  },
  {
    id: "fashion",
    name: "Fashion",
    image: "/images/categories/fashion.jpg",
    description: "Trendy clothing and accessories",
  },
  {
    id: "home",
    name: "Home & Garden",
    image: "/images/categories/home.jpg",
    description: "Furniture and decor",
  },
  {
    id: "beauty",
    name: "Beauty",
    image: "/images/categories/beauty.jpg",
    description: "Skincare and makeup",
  },
  {
    id: "sports",
    name: "Sports",
    image: "/images/categories/sports.jpg",
    description: "Equipment and apparel",
  },
]

export function CategoryCarousel() {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/category/${category.id}`}
            className="group"
          >
            <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square relative">
              {category.image ? (
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">{category.name}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold text-center px-2">
                  {category.name}
                </h3>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
