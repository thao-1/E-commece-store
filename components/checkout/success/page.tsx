// src/app/(main)/checkout/success/page.tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function CheckoutSuccessPage() {
  // Generate a random order number for display purposes
  const orderNumber = `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  return (
    <div className="container mx-auto max-w-lg px-4 py-16">
      <Card className="border-green-100 shadow-lg">
        <CardHeader className="flex flex-col items-center justify-center pb-6">
          <div className="bg-green-100 rounded-full p-3 mb-4">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-center">Order Successful!</h1>
          <p className="text-gray-500 text-center mt-2">
            Thank you for your purchase. Your order has been received.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-bold">{orderNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Order Details</p>
            <p>We've sent a confirmation email with your order details and tracking information.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link href="/user/orders" className="w-full">
            <Button variant="outline" className="w-full">View Order Details</Button>
          </Link>
          <Link href="/products" className="w-full">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}