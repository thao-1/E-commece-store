"use client";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items } = useCart();
  const router = useRouter();

  // If cart is empty, show message and redirect button
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="mb-6">You need to add items to your cart before checking out.</p>
        <Button 
          onClick={() => router.push("/products")}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout form */}
        <div className="lg:w-2/3">
          <CheckoutForm />
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
