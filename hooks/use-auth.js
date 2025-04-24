"use client"

import { useState, useEffect, createContext, useContext } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock authentication check
    // In a real app, you would check with your backend
    const checkAuth = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          // Check if user data exists in localStorage
          const userData = localStorage.getItem('user');
          
          if (userData) {
            setUser(JSON.parse(userData));
          }
          
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Auth check failed:', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      // Simulate API call
      // In a real app, you would call your authentication API
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock user data
          const userData = {
            id: '1',
            name: 'John Doe',
            email: credentials.email,
            role: 'customer',
          };
          
          // Save to state and localStorage
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          
          resolve({ success: true, user: userData });
        }, 1000);
      });
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock user data
          const newUser = {
            id: '1',
            name: userData.name,
            email: userData.email,
            role: 'customer',
          };
          
          // Save to state and localStorage
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          
          resolve({ success: true, user: newUser });
        }, 1000);
      });
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
