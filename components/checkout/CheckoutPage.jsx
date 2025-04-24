// components/checkout/CheckoutPage.jsx
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/router';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CreditCard, Truck, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    shippingAddress: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    billingAddress: {
      sameAsShipping: true,
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    paymentMethod: 'credit_card',
    cardDetails: {
      cardNumber: '',
      nameOnCard: '',
      expiryDate: '',
      cvv: ''
    },
    notes: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e, section = null) => {
    const { name, value } = e.target;
    
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const toggleSameAsShipping = (e) => {
    const sameAsShipping = e.target.checked;
    
    setFormData(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        sameAsShipping,
        ...(sameAsShipping ? {
          fullName: prev.shippingAddress.fullName,
          email: prev.shippingAddress.email,
          phone: prev.shippingAddress.phone,
          address: prev.shippingAddress.address,
          city: prev.shippingAddress.city,
          state: prev.shippingAddress.state,
          zipCode: prev.shippingAddress.zipCode,
          country: prev.shippingAddress.country
        } : {})
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // In a real app, you would process payment and send order to backend
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderData = {
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          vendorId: item.vendorId
        })),
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.billingAddress.sameAsShipping 
          ? formData.shippingAddress 
          : formData.billingAddress,
        paymentMethod: formData.paymentMethod,
        total: cartTotal + 5.99 + (cartTotal * 0.07),
        status: 'processing'
      };
      
      // Call to backend API would happen here
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
      
      const data = await response.json();
      
      // Clear the cart after successful order
      clearCart();
      
      toast({
        title: "Order placed successfully!",
        description: `Your order #${data.orderId} has been confirmed.`,
      });
      
      router.push(`/orders/${data.orderId}`);
    } catch (error) {
      toast({
        title: "Error placing order",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // If cart is empty, redirect to cart page
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="mb-6">You need to add items to your cart before checking out.</p>
        <Button 
          onClick={() => router.push('/products')}
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
          <form onSubmit={handleSubmit}>
            <Accordion type="single" collapsible defaultValue="shipping">
              {/* Shipping Information */}
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Shipping Information
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.shippingAddress.fullName}
                          onChange={(e) => handleChange(e, 'shippingAddress')}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.shippingAddress.email}
                          onChange={(e) => handleChange(e, 'shippingAddress')}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.shippingAddress.phone}
                          onChange={(e) => handleChange(e, 'shippingAddress')}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.shippingAddress.address}
                          onChange={(e) => handleChange(e, 'shippingAddress')}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.shippingAddress.city}
                          onChange={(e) => handleChange(e, 'shippingAddress')}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.shippingAddress.state}
                          onChange={(e) => handleChange(e, 'shippingAddress')}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.shippingAddress.zipCode}
                          onChange={(e) => handleChange(e, 'shippingAddress')}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.shippingAddress.country}
                          onChange={(e) => handleChange(e, 'shippingAddress')}
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              
              {/* Billing Information */}
              <AccordionItem value="billing">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Billing Information
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id="sameAsShipping"
                          checked={formData.billingAddress.sameAsShipping}
                          onChange={toggleSameAsShipping}
                          className="mr-2"
                        />
                        <Label htmlFor="sameAsShipping">Same as shipping address</Label>
                      </div>
                      
                      {!formData.billingAddress.sameAsShipping && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="billing-fullName">Full Name</Label>
                            <Input
                              id="billing-fullName"
                              name="fullName"
                              value={formData.billingAddress.fullName}
                              onChange={(e) => handleChange(e, 'billingAddress')}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="billing-email">Email</Label>
                            <Input
                              id="billing-email"
                              name="email"
                              type="email"
                              value={formData.billingAddress.email}
                              onChange={(e) => handleChange(e, 'billingAddress')}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="billing-phone">Phone Number</Label>
                            <Input
                              id="billing-phone"
                              name="phone"
                              type="tel"
                              value={formData.billingAddress.phone}
                              onChange={(e) => handleChange(e, 'billingAddress')}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="billing-address">Address</Label>
                            <Input
                              id="billing-address"
                              name="address"
                              value={formData.billingAddress.address}
                              onChange={(e) => handleChange(e, 'billingAddress')}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="billing-city">City</Label>
                            <Input
                              id="billing-city"
                              name="city"
                              value={formData.billingAddress.city}
                              onChange={(e) => handleChange(e, 'billingAddress')}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="billing-state">State/Province</Label>
                            <Input
                              id="billing-state"
                              name="state"
                              value={formData.billingAddress.state}
                              onChange={(e) => handleChange(e, 'billingAddress')}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="billing-zipCode">ZIP/Postal Code</Label>
                            <Input
                              id="billing-zipCode"
                              name="zipCode"
                              value={formData.billingAddress.zipCode}
                              onChange={(e) => handleChange(e, 'billingAddress')}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="billing-country">Country</Label>
                            <Input
                              id="billing-country"
                              name="country"
                              value={formData.billingAddress.country}
                              onChange={(e) => handleChange(e, 'billingAddress')}
                              required
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              
              {/* Payment Method */}
              <AccordionItem value="payment">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Method
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="pt-6">
                      <RadioGroup 
                        defaultValue="credit_card"
                        value={formData.paymentMethod} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="credit_card" id="credit_card" />
                          <Label htmlFor="credit_card">Credit / Debit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal">PayPal</Label>
                        </div>
                      </RadioGroup>
                      
                      {formData.paymentMethod === 'credit_card' && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              name="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={formData.cardDetails.cardNumber}
                              onChange={(e) => handleChange(e, 'cardDetails')}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="nameOnCard">Name on Card</Label>
                            <Input
                              id="nameOnCard"
                              name="nameOnCard"
                              value={formData.cardDetails.nameOnCard}
                              onChange={(e) => handleChange(e, 'cardDetails')}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={formData.cardDetails.expiryDate}
                              onChange={(e) => handleChange(e, 'cardDetails')}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              placeholder="123"
                              value={formData.cardDetails.cvv}
                              onChange={(e) => handleChange(e, 'cardDetails')}
                              required
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              
              {/* Order Notes */}
              <AccordionItem value="notes">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Delivery Instructions (Optional)
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="notes">Order Notes</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          placeholder="Add any special instructions for delivery"
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-8">
              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4">
                By placing your order, you agree to our{" "}
                <Link href="/terms" className="text-orange-600 hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="divide-y">
                {cart.map((item) => (
                  <li key={item._id} className="py-2 flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>$5.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (7%):</span>
                  <span>${(cartTotal * 0.07).toFixed(2)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${(cartTotal + 5.99 + cartTotal * 0.07).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}