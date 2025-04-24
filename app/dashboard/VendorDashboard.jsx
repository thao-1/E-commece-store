import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/utils/auth-context';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package, 
  MessageSquare, 
  Settings, 
  PlusCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Dashboard Analytics Component
const DashboardAnalytics = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <DollarSign size={24} className="text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-xl font-bold">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <ShoppingBag size={24} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-xl font-bold">{stats.orders}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 mr-4">
            <Package size={24} className="text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Products</p>
            <p className="text-xl font-bold">{stats.products}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-orange-100 mr-4">
            <MessageSquare size={24} className="text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">New Messages</p>
            <p className="text-xl font-bold">{stats.messages}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recent Orders Component
const RecentOrders = ({ orders }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <Link to="/vendor/orders" className="text-orange-500 hover:text-orange-600">
          View All
        </Link>
      </div>
      
      {orders.length === 0 ? (
        <p className="text-gray-500">No recent orders</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <Link to={`/vendor/orders/${order._id}`} className="text-blue-600 hover:underline">
                      #{order._id.substring(0, 8)}
                    </Link>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">{order.customerName}</td>
                  <td className="py-3 px-3 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">${order.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Low Stock Products Alert Component
const LowStockAlert = ({ products }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Low Stock Alert</h2>
        <Link to="/vendor/products" className="text-orange-500 hover:text-orange-600">
          Manage Inventory
        </Link>
      </div>
      
      {products.length === 0 ? (
        <p className="text-gray-500">No low stock products</p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product._id} className="flex justify-between items-center p-3 bg-red-50 rounded-md">
              <div className="flex items-center">
                <AlertCircle size={20} className="text-red-500 mr-2" />
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    <span className="text-red-500 font-medium">{product.quantity}</span> items left in stock
                  </p>
                </div>
              </div>
              <Link to={`/vendor/products/edit/${product._id}`} className="px-3 py-1 bg-white text-orange-500 rounded border border-orange-500 hover:bg-orange-500 hover:text-white transition-colors">
                Update
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const VendorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    messages: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch dashboard stats
        const statsResponse = await fetch('/api/vendors/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        
        const statsData = await statsResponse.json();
        setStats(statsData);
        
        // Fetch recent orders
        const ordersResponse = await fetch('/api/vendors/dashboard/recent-orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch recent orders');
        }
        
        const ordersData = await ordersResponse.json();
        setRecentOrders(ordersData);
        
        // Fetch low stock products
        const productsResponse = await fetch('/api/vendors/dashboard/low-stock', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch low stock products');
        }
        
        const productsData = await productsResponse.json();
        setLowStockProducts(productsData);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <Link to="/vendor/products/new" className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
          <PlusCircle size={18} className="mr-2" />
          Add New Product
        </Link>
      </div>
      
      <DashboardAnalytics stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders orders={recentOrders} />
        </div>
        <div>
          <LowStockAlert products={lowStockProducts} />
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;