import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

export function OrderSummary() {
  const cart = useCart();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  // Calculate totals
  const subtotal = cart.items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);
  
  const shippingCost = 10.00;
  const taxRate = 0.07; // 7% tax
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + shippingCost + taxAmount;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                {item.images?.[0]?.url && (
                  <Image
                    src={item.images[0].url}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity} x {formatPrice(item.price)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(Number(item.price) * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-gray-500">Subtotal</p>
            <p className="font-medium">{formatPrice(subtotal)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-500">Shipping</p>
            <p className="font-medium">{formatPrice(shippingCost)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-500">Tax</p>
            <p className="font-medium">{formatPrice(taxAmount)}</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-between text-lg font-bold">
          <p>Total</p>
          <p>{formatPrice(totalAmount)}</p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full text-sm text-gray-500">
          <p>Your personal data will be used to process your order, support your experience, and for other purposes described in our privacy policy.</p>
        </div>
      </CardFooter>
    </Card>
  );
}