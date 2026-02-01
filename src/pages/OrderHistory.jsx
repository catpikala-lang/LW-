import { useState } from 'react';
import { Search, Package, CheckCircle, Clock, Truck, Phone, Calendar, DollarSign } from 'lucide-react';
import { getOrdersByPhone } from '../firebase/firestoreFunctions';

// ১. ট্র্যাকিং টাইমলাইন কম্পোনেন্ট (বাটন সহ)
function OrderTrackingTimeline({ order }) {
  const trackingSteps = [
    { 
      label: 'অর্ডার প্লেসড', 
      date: order.createdAt, 
      icon: <Package className="w-5 h-5" />,
      completed: true 
    },
    { 
      label: 'অর্ডার কনফার্মড', 
      date: order.confirmedAt, 
      icon: <CheckCircle className="w-5 h-5" />,
      completed: order.status === 'confirmed' 
    },
    { 
      label: 'প্রসেসিং', 
      date: order.processingAt, 
      icon: <Clock className="w-5 h-5" />,
      completed: order.status === 'shipped' 
    },
    { 
      label: 'ডেলিভার্ড', 
      date: order.shippedAt || order.deliveredAt, 
      icon: <CheckCircle className="w-5 h-5" />,
      completed: order.status === 'delivered' 
    },
  ];

  return (
    <div className="tracking-section bg-gray-50 rounded-xl p-5 mt-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center text-gray-800">
          <Truck className="w-5 h-5 mr-2 text-accent" />
          অর্ডার স্ট্যাটাস ট্র্যাকিং
        </h3>
        
        {/* সেই কাঙ্ক্ষিত ট্র্যাক বাটন */}
        {order.trackingLink && order.trackingLink !== '#' ? (
          <a
            href={order.trackingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent hover:bg-accent/90 text-white px-7 py-3 rounded-xl text-base font-extrabold flex items-center gap-2 transition-all shadow-lg border-2 border-accent/30 scale-110"
            style={{ letterSpacing: '1px', fontSize: '1.15rem' }}
          >
            <Truck className="w-6 h-6 mr-2" />
            লাইভ ট্র্যাক
          </a>
        ) : (
          order.status === 'shipped' && (
              <span className="text-xs text-gray-500 italic font-medium block mt-2 sm:mt-0">লিঙ্ক শীঘ্রই আসছে</span>
          )
        )}
      </div>
      
      <div className="space-y-6 relative">
        {trackingSteps.map((step, index) => (
          <div key={index} className="flex items-start">
            <div className="relative flex flex-col items-center mr-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full z-10 shadow-sm
                ${step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {step.completed ? <CheckCircle className="w-6 h-6" /> : step.icon}
              </div>
              {index < trackingSteps.length - 1 && (
                <div className={`w-0.5 h-8 absolute top-10 
                  ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`} 
                />
              )}
            </div>
            
            <div className="flex-1 pt-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`font-bold text-sm md:text-base ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  {step.date && step.completed && (
                    <p className="text-xs text-gray-500">
                      {new Date(step.date?.seconds * 1000 || step.date).toLocaleDateString('bn-BD', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
                <span className={`text-[10px] md:text-xs px-2 py-1 rounded font-medium ${step.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {step.completed ? 'সম্পন্ন' : 'অপেক্ষাধীন'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ২. মেইন অর্ডার হিস্ট্রি কম্পোনেন্ট
export default function OrderHistory() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchOrders = async () => {
    if (!phone.trim()) {
      setError('ফোন নম্বর দিন');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const result = await getOrdersByPhone(phone);
      if (result.success) {
        setOrders(result.orders);
        if (result.orders.length === 0) setError('এই ফোন নম্বরে কোন অর্ডার নেই');
      } else {
        setError('অর্ডার লোড করতে সমস্যা: ' + result.error);
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
    setLoading(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000 || timestamp);
      return date.toLocaleDateString('bn-BD', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch { return 'Invalid Date'; }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'পেন্ডিং', icon: <Clock className="w-4 h-4 mr-1" /> },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'কনফার্মড', icon: <CheckCircle className="w-4 h-4 mr-1" /> },
      shipped: { color: 'bg-purple-100 text-purple-800', label: 'শিপড', icon: <Truck className="w-4 h-4 mr-1" /> },
      delivered: { color: 'bg-green-100 text-green-800', label: 'ডেলিভার্ড', icon: <CheckCircle className="w-4 h-4 mr-1" /> },
    };
    const current = badges[status] || { color: 'bg-gray-100 text-gray-800', label: status, icon: null };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${current.color}`}>
        {current.icon} {current.label}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900">আপনার অর্ডারসমূহ</h1>
        <p className="text-gray-600">ফোন নম্বর দিয়ে আপনার অর্ডারের বর্তমান অবস্থা দেখুন</p>
      </div>

      {/* সার্চ সেকশন */}
      <div className="bg-white rounded-2xl shadow-xl border p-6 mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-sm font-bold mb-2 flex items-center text-gray-700">
              <Phone className="w-4 h-4 mr-2 text-accent" />
              আপনার ফোন নম্বর
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
              />
            </div>
          </div>
          <button
            onClick={searchOrders}
            disabled={loading}
            className="w-full md:w-auto bg-black text-white px-10 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'লোড হচ্ছে...' : (
              <><Search className="w-5 h-5 mr-2" /> অর্ডার খুঁজুন</>
            )}
          </button>
        </div>
        {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{error}</div>}
      </div>

      {/* রেজাল্ট সেকশন */}
      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-lg border overflow-hidden transition-hover hover:shadow-2xl">
            {/* অর্ডার হেডার */}
            <div className="p-6 border-b bg-gray-50/50">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Package className="text-accent w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-xl text-gray-900">অর্ডার #{order.orderNumber}</h2>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1" /> {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  {getStatusBadge(order.status)}
                  <div className="text-2xl font-black text-accent mt-2 flex items-center">
                    <DollarSign className="w-6 h-6" />
                    <span>{order.total?.toLocaleString('bn-BD')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* মেইন বডি */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* ১. প্রোডাক্ট এবং কাস্টমার ইনফো */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">📦 পণ্য ও পেমেন্ট</h3>
                    <div className="space-y-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.name} <b className="text-gray-900">x{item.quantity}</b></span>
                          <span className="font-bold text-gray-800">৳{(item.price * item.quantity).toLocaleString('bn-BD')}</span>
                        </div>
                      ))}
                      <div className="pt-3 border-t text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>সাবটোটাল:</span>
                          <span>৳{order.subtotal?.toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ডেলিভারি চার্জ:</span>
                          <span>{order.shipping === 0 ? 'ফ্রি' : `৳${order.shipping}`}</span>
                        </div>
                        <div className="flex justify-between font-extrabold text-lg text-accent pt-1">
                          <span>সর্বমোট:</span>
                          <span>৳{order.total?.toLocaleString('bn-BD')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">👤 গ্রাহকের তথ্য</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-bold text-gray-900">নাম:</span> {order.customer?.name}</p>
                      <p><span className="font-bold text-gray-900">ফোন:</span> {order.customer?.phone}</p>
                      <p><span className="font-bold text-gray-900">ঠিকানা:</span> {order.customer?.address}</p>
                    </div>
                  </div>
                </div>

                {/* ২. ট্র্যাকিং ভিজুয়ালাইজার */}
                <OrderTrackingTimeline order={order} />
              </div>
            </div>
          </div>
        ))}

        {/* যদি কোনো অর্ডার না থাকে */}
        {!loading && orders.length === 0 && phone && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border">
            <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">কোন অর্ডার খুঁজে পাওয়া যায়নি</h3>
            <p className="text-gray-500">অনুগ্রহ করে সঠিক ফোন নম্বরটি দিয়ে আবার চেষ্টা করুন।</p>
          </div>
        )}
      </div>
    </div>
  );
}