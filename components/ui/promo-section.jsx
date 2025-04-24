"use client"

import React from "react"
import Link from "next/link"
import { Button } from "./button"

export function PromoSection() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* First Promo */}
          <div className="relative rounded-lg overflow-hidden h-80">
            <img 
              src="/images/promos/summer-sale.jpg" 
              alt="Summer Sale"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-start justify-center p-8">
              <h3 className="text-white text-3xl font-bold mb-2">Summer Sale</h3>
              <p className="text-white text-lg mb-4">Up to 50% off on selected items</p>
              <Button className="bg-white text-black hover:bg-gray-100">
                <Link href="/sale">Shop Now</Link>
              </Button>
            </div>
          </div>
          
          {/* Second Promo */}
          <div className="relative rounded-lg overflow-hidden h-80">
            <img 
              src="/images/promos/new-arrivals.jpg" 
              alt="New Arrivals"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-start justify-center p-8">
              <h3 className="text-white text-3xl font-bold mb-2">New Arrivals</h3>
              <p className="text-white text-lg mb-4">Check out our latest products</p>
              <Button className="bg-white text-black hover:bg-gray-100">
                <Link href="/new-arrivals">Discover</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
