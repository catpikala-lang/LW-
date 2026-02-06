import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Phone, MapPin, Package, DollarSign, 
  CheckCircle, Truck, Calendar, MessageCircle, Copy 
} from 'lucide-react';
import { doc, getDoc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { sendPurchaseEvent } from '../utils/facebookCAPI';


// Order confirm function
const confirmOrder = async () => {
  if (!window.confirm('আপনি কি নিশ্চিতভাবে অর্ডারটি কনফার্ম করতে চান?')) return;
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: "confirmed",
      trackingLink: trackingLink,
      updatedAt: serverTimestamp()
    });
    toast.success('অর্ডার কনফার্ম করা হয়েছে!');
    loadOrder(); // Reload order
    if (order && order.status === 'pending') {
      const capiResult = await sendPurchaseEvent({
        orderId: order.orderNumber,
        amount: order.total,
        customerPhone: order.customer?.phone,
        products: order.items
      });
      if (capiResult) {
        console.log('Facebook CAPI event sent');
      }
    }
  } catch (error) {
    console.error("Error updating order:", error);
    toast.error('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে!');
  }
};

export default function AdminOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingLink, setTrackingLink] = useState('');

  // Order cancel (delete) function
  const cancelOrder = async () => {
    if (!window.confirm('আপনি কি নিশ্চিতভাবে অর্ডারটি বাতিল করতে চান?')) return;
    try {
      const orderRef = doc(db, 'orders', orderId);
      await deleteDoc(orderRef);
      toast.success('অর্ডার বাতিল করা হয়েছে!');
      navigate('/admin');
    } catch (error) {
      toast.error('অর্ডার বাতিল করতে সমস্যা হয়েছে!');
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const docRef = doc(db, "orders", orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
        setTrackingLink(docSnap.data().trackingLink || '');
      }
    } catch (error) {
      console.error("Error loading order:", error);
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('কপি করা হয়েছে!');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <button onClick={() => navigate('/admin')} className="btn-primary">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => navigate('/admin')}
            className="text-accent hover:underline flex items-center mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </button>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className={`px-4 py-1 rounded-full ${getStatusColor(order.status)}`}>
              {order.status.toUpperCase()}
            </span>
            <span className="text-gray-600">Order ID: {order.orderNumber}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Name</div>
                <div className="font-semibold">{order.customer?.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Phone</div>
                <div className="font-semibold flex items-center">
                  {order.customer?.phone}
                  <button 
                    onClick={() => copyToClipboard(order.customer?.phone)}
                    className="ml-2 text-accent hover:text-accent-dark"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-600 mb-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Delivery Address
                </div>
                <div className="font-semibold">{order.customer?.address}</div>
              </div>
              {order.customer?.notes && (
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-600 mb-1">Customer Notes</div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    {order.customer?.notes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold">
                    ৳{(item.price * item.quantity).toLocaleString('bn-BD')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Summary */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">৳{order.subtotal?.toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {order.shipping === 0 ? 'FREE' : `৳${order.shipping}`}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-accent">৳{order.total?.toLocaleString('bn-BD')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Management */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Tracking Management
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tracking Link</label>
                <input
                  type="text"
                  value={trackingLink}
                  onChange={(e) => setTrackingLink(e.target.value)}
                  placeholder="https://steadfast.com.bd/tracking/TRK123"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <button
                  className="w-full btn-primary py-2"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      const orderRef = doc(db, 'orders', orderId);
                      await updateDoc(orderRef, {
                        trackingLink: trackingLink,
                        updatedAt: serverTimestamp(),
                      });
                      toast.success('ট্র্যাকিং লিঙ্ক সংরক্ষণ হয়েছে!');
                      loadOrder();
                    } catch (err) {
                      toast.error('ট্র্যাকিং লিঙ্ক সংরক্ষণ ব্যর্থ হয়েছে!');
                    }
                  }}
                >
                  Save Tracking Link
                </button>
                
                <button 
                  onClick={() => copyToClipboard(trackingLink)}
                  disabled={!trackingLink}
                  className="w-full border border-accent text-accent py-2 rounded-lg disabled:opacity-50"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                className="w-full bg-green-100 text-green-800 py-2 rounded-lg font-medium hover:bg-green-200"
                onClick={() => updateOrderStatus('confirmed')}
              >
                <CheckCircle className="w-5 h-5 inline mr-2" />
                Mark as Confirmed
              </button>
              
              <button 
                className="w-full bg-purple-100 text-purple-800 py-2 rounded-lg font-medium hover:bg-purple-200"
                onClick={() => updateOrderStatus('shipped')}
              >
                <Truck className="w-5 h-5 inline mr-2" />
                Mark as Shipped
              </button>
              
              <button className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50">
                <MessageCircle className="w-5 h-5 inline mr-2" />
                Send WhatsApp Update
              </button>

              <button
                className="w-full bg-red-100 text-red-800 py-2 rounded-lg font-medium hover:bg-red-200 mt-2"
                onClick={cancelOrder}
              >
                অর্ডার বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}