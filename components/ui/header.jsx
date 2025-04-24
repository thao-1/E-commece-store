"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    // Get cart items from local storage
    const getCartItems = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };

    window.addEventListener('scroll', handleScroll);
    checkAuth();
    getCartItems();

    // Listen for storage events (for cart updates)
    window.addEventListener('storage', getCartItems);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', getCartItems);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout');
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'Deals', href: '/deals' },
    { name: 'Vendors', href: '/vendors' },
    { name: 'Messages', href: '/messages' },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full ${isScrolled ? 'bg-white shadow-md' : 'bg-yellow-50'} transition-all duration-200`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="Marketplace Logo"
                className="h-8 w-auto mr-2"
              />
              <span className="font-bold text-xl text-orange-600">MarketPlace</span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium hover:text-orange-500 transition-colors ${
                  pathname === link.href ? 'text-orange-600' : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="w-full relative">
              <Input
                type="text"
                placeholder="Search products, vendors..."
                className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-orange-200 focus:border-orange-400 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Search
              </Button>
            </form>
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="py-2 px-4 text-sm text-gray-500">No new notifications</div>
                ) : (
                  notifications.map((notification, index) => (
                    <DropdownMenuItem key={index} className="cursor-pointer">
                      {notification.message}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border-2 border-orange-200">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild></DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="w-full">Orders</Link>
                  </DropdownMenuItem>
                  {user.role === 'vendor' && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="w-full">Vendor Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <span className="font-bold text-lg">Menu</span>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                  </div>

                  {/* Mobile Search */}
                  <div className="py-4">
                    <form onSubmit={handleSearch} className="relative">
                      <Input
                        type="text"
                        placeholder="Search products, vendors..."
                        className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-orange-200 focus:border-orange-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </form>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-4 mt-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`text-base font-medium hover:text-orange-500 transition-colors ${
                          pathname === link.href ? 'text-orange-600' : 'text-gray-700'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile User Actions */}
                  <div className="mt-auto pb-8">
                    {user ? (
                      <>
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-orange-200">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                              <User className="h-full w-full p-2" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Link href="/profile" className="block w-full px-4 py-2 text-sm rounded-md hover:bg-gray-100">
                            Profile
                          </Link>
                          <Link href="/orders" className="block w-full px-4 py-2 text-sm rounded-md hover:bg-gray-100">
                            Orders
                          </Link>
                          {user.role === 'vendor' && (
                            <Link href="/dashboard" className="block w-full px-4 py-2 text-sm rounded-md hover:bg-gray-100">
                              Vendor Dashboard
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="block w-full px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 text-left"
                          >
                            Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Button asChild variant="outline" className="w-full">
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                          <Link href="/register">Register</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}