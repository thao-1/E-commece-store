"use client"

import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'react-hot-toast';

// Create a context for the cart
const CartContext = createContext();

// Cart item type
// id: string
// name: string
// price: number
// quantity: number
// image?: string
// vendorId: string
// vendorName: string

// Provider component
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(items));

      // Dispatch storage event for other tabs
      window.dispatchEvent(new Event('storage'));
    }
  }, [items, isLoading]);

  // Add item to cart
  const addItem = (item) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + (item.quantity || 1),
        };

        toast.success(`Updated ${item.name} quantity in cart`);
        return updatedItems;
      } else {
        // Add new item
        toast.success(`Added ${item.name} to cart`);
        return [...prevItems, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  // Update item quantity
  const updateItemQuantity = (id, quantity) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity };
        }
        return item;
      });

      return updatedItems;
    });
  };

  // Remove item from cart
  const removeItem = (id) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.name} from cart`);
      }

      return prevItems.filter((item) => item.id !== id);
    });
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  // Calculate total price
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Calculate total items
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Group items by vendor
  const getItemsByVendor = () => {
    const groupedItems = {};

    items.forEach((item) => {
      if (!groupedItems[item.vendorId]) {
        groupedItems[item.vendorId] = {
          vendorId: item.vendorId,
          vendorName: item.vendorName,
          items: [],
        };
      }

      groupedItems[item.vendorId].items.push(item);
    });

    return Object.values(groupedItems);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
        getTotalPrice,
        getTotalItems,
        getItemsByVendor,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
