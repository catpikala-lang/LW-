import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Package, CheckCircle, Clock, Truck, Download, 
  LogOut, Users, DollarSign, BarChart, Plus, 
  ShoppingBag, Tag, Settings
} from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../firebase/firestoreFunctions.js';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [adminEmail, setAdminEmail] = useState('');
  
  // Check if admin is logged in
  useEffect(() => {
    const storedEmail = localStorage.getItem('adminEmail');
    const validEmails = ["catpikala@gmail.com", "tor-email@gmail.com", "admin@leatherwallah.com"];
    
    if (!storedEmail || !validEmails.includes(storedEmail)) {
      navigate('/admin-login');
    } else {
      setAdminEmail(storedEmail);
    }
  }, [navigate]);
  
  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);
  
  const loadOrders = async () => {
    setLoading(true);
    try {
      const result = await getAllOrders();
      if (result.success) {
        console.log("Orders loaded:", result.orders);
        setOrders(result.orders);
      } else {
        console.error("Failed to load orders:", result.error);
      }
    } catch (error) {
      console.error("Error in loadOrders:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    navigate('/admin-login');
  };
  
  const handleStatusUpdate = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      loadOrders(); // Refresh list
      toast.success('অর্ডার স্ট্যাটাস সফলভাবে আপডেট হয়েছে!');
    }
  };
  
  // Filter orders by status
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const confirmedOrders = orders.filter(o => o.status === 'confirmed');
  const shippedOrders = orders.filter(o => o.status === 'shipped');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  
  // Stats
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const todayOrders = orders.filter(o => {
    const orderDate = o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });
  const todayRevenue = todayOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  
  // Product management functions
  const handleExportOrders = () => {
    toast.success('Export feature coming soon!');
  };
  
  const handleExportCustomers = () => {
    toast.success('Customer export feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-200">Leather Wallah Management System</p>
                <div className="text-sm mt-1">
                  Logged in as: <span className="font-semibold">{adminEmail}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button
                onClick={() => navigate('/admin/settings')}
                className="flex items-center text-white hover:text-gray-300"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Action Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/admin/products"
              className="flex items-center bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              নতুন পণ্য যোগ করুন
            </Link>
            <Link 
              to="/admin/products" 
              className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <ShoppingBag className="inline-block w-4 h-4 mr-2" />
              পণ্যসমূহ
            </Link>
            <Link 
              to="/admin/banner-manager" 
              className="flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Tag className="inline-block w-4 h-4 mr-2" />
              ব্যানার ইমেজ
            </Link>
            <Link 
              to="/admin/products-list"
              className="flex items-center bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold shadow transition"
              title="Manage Products"
            >
              <span className="mr-2" style={{ fontSize: '1.2rem' }}>🛒</span>
              ম্যানেজ পণ্য
            </Link>
            <Link 
              to="/admin/customers"
              className="flex items-center border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              Customer List
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-800">{orders.length}</div>
                <div className="text-gray-600">Total Orders</div>
              </div>
              <Package className="w-12 h-12 text-blue-500 opacity-80" />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <span className="text-green-600 font-semibold">+{todayOrders.length} today</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg p-6 border border-amber-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-800">{pendingOrders.length}</div>
                <div className="text-gray-600">Pending Orders</div>
              </div>
              <Clock className="w-12 h-12 text-amber-500 opacity-80" />
            </div>
            <div className="mt-4">
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full" 
                  style={{ width: `${orders.length ? (pendingOrders.length/orders.length)*100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          

          
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-800">{todayOrders.length}</div>
                <div className="text-gray-600">Today's Orders</div>
              </div>
              <Users className="w-12 h-12 text-green-500 opacity-80" />
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-500">
                Avg: ৳{todayOrders.length ? Math.round(todayRevenue/todayOrders.length).toLocaleString('bn-BD') : '0'} per order
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Orders Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-6 py-4 font-medium whitespace-nowrap flex items-center ${activeTab === 'pending' ? 'border-b-2 border-accent text-accent bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Pending ({pendingOrders.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('confirmed')}
                    className={`px-6 py-4 font-medium whitespace-nowrap flex items-center ${activeTab === 'confirmed' ? 'border-b-2 border-accent text-accent bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Confirmed ({confirmedOrders.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('shipped')}
                    className={`px-6 py-4 font-medium whitespace-nowrap flex items-center ${activeTab === 'shipped' ? 'border-b-2 border-accent text-accent bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Truck className="w-5 h-5 mr-2" />
                    Shipped ({shippedOrders.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('delivered')}
                    className={`px-6 py-4 font-medium whitespace-nowrap flex items-center ${activeTab === 'delivered' ? 'border-b-2 border-accent text-accent bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Delivered ({deliveredOrders.length})
                  </button>
                </div>
              </div>
              
              {/* Orders Table */}
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-4 text-left text-gray-700 font-semibold">Order ID</th>
                          <th className="p-4 text-left text-gray-700 font-semibold">Customer</th>
                          <th className="p-4 text-left text-gray-700 font-semibold">Phone</th>
                          <th className="p-4 text-left text-gray-700 font-semibold">Amount</th>
                          <th className="p-4 text-left text-gray-700 font-semibold">Date</th>
                          <th className="p-4 text-left text-gray-700 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(activeTab === 'pending' ? pendingOrders : 
                          activeTab === 'confirmed' ? confirmedOrders : 
                          activeTab === 'shipped' ? shippedOrders : 
                          deliveredOrders).map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div className="font-semibold text-gray-800">{order.orderNumber}</div>
                              <div className="text-sm text-gray-500">Items: {order.items?.length || 0}</div>
                            </td>
                            <td className="p-4">
                              <div className="font-medium">{order.customer?.name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {order.customer?.address}
                              </div>
                            </td>
                            <td className="p-4">
                              <a href={`tel:${order.customer?.phone}`} className="text-accent hover:underline font-medium">
                                {order.customer?.phone}
                              </a>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-gray-800">
                                ৳{Number(order.total || 0).toLocaleString('bn-BD')}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-gray-700">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('bn-BD') : 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.createdAt ? new Date(order.createdAt).toLocaleTimeString('bn-BD') : ''}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-2">
                                {order.status === 'pending' && (
                                  <button
                                    onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                                    className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {order.status === 'confirmed' && (
                                  <button
                                    onClick={() => handleStatusUpdate(order.id, 'shipped')}
                                    className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                                  >
                                    Mark Shipped
                                  </button>
                                )}
                                {order.status === 'shipped' && (
                                  <button
                                    onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                    className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                                  >
                                    Mark Delivered
                                  </button>
                                )}
                                <button
                                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                                  className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                                >
                                  Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {((activeTab === 'pending' && pendingOrders.length === 0) ||
                      (activeTab === 'confirmed' && confirmedOrders.length === 0) ||
                      (activeTab === 'shipped' && shippedOrders.length === 0) ||
                      (activeTab === 'delivered' && deliveredOrders.length === 0)) && (
                      <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <Package className="w-16 h-16 mx-auto" />
                        </div>
                        <div className="text-gray-500 text-lg mb-2">No orders found</div>
                        <p className="text-gray-400">No orders available in this category.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Quick Actions & Stats */}
          <div className="space-y-8">
            {/* Export Data Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-800">
                <Download className="w-5 h-5 mr-2 text-gray-600" /> Export Data
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={handleExportOrders}
                  className="w-full bg-gradient-to-r from-secondary to-blue-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity font-medium"
                >
                  Export Orders (Excel)
                </button>
                <button 
                  onClick={handleExportCustomers}
                  className="w-full border-2 border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Export Customers (CSV)
                </button>
                <button 
                  onClick={() => navigate('/admin/reports')}
                  className="w-full border-2 border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Generate Reports
                </button>
              </div>
            </div>
            
            {/* Quick Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-800">
                <BarChart className="w-5 h-5 mr-2 text-gray-600" /> Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Avg. Order Value:</span>
                  <span className="font-bold text-gray-800">
                    ৳{orders.length > 0 ? Math.round(totalRevenue/orders.length).toLocaleString('bn-BD') : '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Conversion Rate:</span>
                  <span className="font-bold text-green-600">
                    {orders.length > 0 ? Math.round((deliveredOrders.length/orders.length)*100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Avg. Processing Time:</span>
                  <span className="font-bold text-gray-800">2.5 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Customer Satisfaction:</span>
                  <span className="font-bold text-yellow-600">4.8/5</span>
                </div>
              </div>
            </div>
            
            {/* Admin Notes Card */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">📝 Admin Notes</h3>
              <textarea 
                className="w-full border-2 border-gray-200 rounded-xl p-4 mb-4 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                rows="4" 
                placeholder="Add notes for today, reminders, or important information..."
              />
              <div className="flex space-x-3">
                <button className="flex-1 bg-primary text-white py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium">
                  Save Notes
                </button>
                <button className="px-4 border-2 border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  Clear
                </button>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">⚡ Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  to="/admin/products"
                  className="bg-blue-50 text-blue-700 p-3 rounded-lg text-center hover:bg-blue-100 transition-colors"
                >
                  Products
                </Link>
                <Link 
                  to="/admin/categories"
                  className="bg-green-50 text-green-700 p-3 rounded-lg text-center hover:bg-green-100 transition-colors"
                >
                  Categories
                </Link>
                <Link 
                  to="/admin/customers"
                  className="bg-purple-50 text-purple-700 p-3 rounded-lg text-center hover:bg-purple-100 transition-colors"
                >
                  Customers
                </Link>
                <Link 
                  to="/admin/analytics"
                  className="bg-amber-50 text-amber-700 p-3 rounded-lg text-center hover:bg-amber-100 transition-colors"
                >
                  Analytics
                </Link>
                <Link 
                  to="/admin/products-list"
                  className="w-full border border-yellow-400 py-2 rounded-lg hover:bg-yellow-50 text-center font-bold text-yellow-700"
                >
                  ম্যানেজ পণ্য
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}