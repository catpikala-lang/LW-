import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Truck, Shield, Phone, MapPin, Home, MessageCircle,
  ArrowLeft, CheckCircle, CreditCard, Package
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
// Firebase functions import করা হলো
import { saveOrder, generateOrderNumber } from '../firebase/firestoreFunctions';
import { FBEvents } from '../utils/facebookPixel';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, shipping, total, clearCart, setShipping } = useCart();
  const [deliveryArea, setDeliveryArea] = useState('dhaka'); // Default to Dhaka
  const [deliveryArea, setDeliveryArea] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    address: '',
    thana: '',
    district: '',
    notes: '',
    size: ''
  });

  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cartItems.length > 0) {
      const totalValue = total;
      const productIds = cartItems.map(item => item.id);
      FBEvents.initiateCheckout(totalValue, 'BDT', productIds);
    }
  }, [cartItems, total]);

  const handleChange = (e) => {
      // Delivery area selection handler
      const handleDeliveryAreaChange = (e) => {
        const area = e.target.value;
        setDeliveryArea(area);
        if (area === 'dhaka') {
          setShipping(70);
        } else if (area === 'outsideDhaka') {
          setShipping(130);
        }
      };
      // Set initial shipping fee on mount
      useEffect(() => {
        setShipping(deliveryArea === 'dhaka' ? 70 : 130);
      }, []);
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ১. ফর্ম ভ্যালিডেশন
    if (!formData.name || !formData.phone || !formData.address || !formData.district || !formData.thana) {
      toast.error('দয়া করে সব প্রয়োজনীয় তথ্য দিন');
      return;
    }

    setIsSubmitting(true);

    // ২. ইউনিক অর্ডার নাম্বার তৈরি
    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);
    
    // ৩. ফায়ারবেস এর জন্য ডাটা সাজানো
    const orderData = {
      orderNumber: newOrderNumber,
      customer: {
        name: formData.name,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        address: `${formData.address}, ${formData.thana}, ${formData.district}`,
        notes: formData.notes,
        size: formData.size,
        thana: formData.thana,
        district: formData.district
      },
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.images?.[0] || ''
      })),
      subtotal: subtotal,
      shipping: shipping,
      total: total,
      status: 'pending',
      paymentMethod: 'COD'
    };

    try {
      // ৪. Firebase এ ডাটা সেভ করা
      const saveResult = await saveOrder(orderData);
      
      if (!saveResult.success) {
        throw new Error(saveResult.error);
      }
      
      // ৫. WhatsApp মেসেজ তৈরি
      const adminPhone = "8801956869107"; 
      const whatsappMessage = 
        `*নতুন ওয়েবসাইট অর্ডার!* 🛒\n` +
        `═══════════════════════\n` +
        `📦 *অর্ডার নম্বর:* ${newOrderNumber}\n` +
        `👤 *কাস্টমার:* ${formData.name}\n` +
        `📞 *ফোন:* ${formData.phone}\n` +
        `${formData.size ? `📏 *সাইজ:* ${formData.size}\n` : ''}` +
        `🏠 *ঠিকানা:* ${formData.address}, ${formData.thana}, ${formData.district}\n` +
        `💰 *মোট বিল: ৳${total.toLocaleString('bn-BD')}*\n` +
        `═══════════════════════\n` +
        `দ্রুত অর্ডারটি কনফার্ম করুন।`;

      const whatsappURL = `https://wa.me/${adminPhone}?text=${encodeURIComponent(whatsappMessage)}`;
      
      // ৬. সাকসেস স্টেট আপডেট
      setOrderSubmitted(true);
      toast.success('অর্ডারটি সফলভাবে ডাটাবেজে সেভ হয়েছে!');
      
      // ৭. কার্ট খালি করা এবং হোয়াটসঅ্যাপ ওপেন করা
      setTimeout(() => {
        clearCart();
        window.open(whatsappURL, '_blank');
      }, 1500);

      // ৮. Facebook Pixel Purchase
      FBEvents.purchase(
        total,
        'BDT',
        cartItems.map(item => item.id),
        newOrderNumber
      );

    } catch (error) {
      console.error('Order submission failed:', error);
      toast.error('অর্ডার সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Success UI এবং Form UI আগের মতোই থাকবে ---
  if (orderSubmitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <div className="absolute -top-2 -right-2 bg-accent text-white rounded-full w-12 h-12 flex items-center justify-center animate-bounce">
              <Package className="w-6 h-6" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-green-600">
            অর্ডার সফল হয়েছে! 🎉
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            ধন্যবাদ, {formData.name}! আপনার অর্ডারটি আমরা পেয়েছি।
          </p>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-left">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-500 mb-1">আপনার অর্ডার নম্বর</div>
              <div className="text-3xl font-bold text-accent bg-gray-50 py-3 px-6 rounded-lg inline-block">
                {orderNumber}
              </div>
            </div>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">অর্ডার গ্রহণ করা হয়েছে</h3>
                  <p className="text-gray-600">আমরা আপনার অর্ডারটি পেয়েছি এবং এটি ডাটাবেজে সেভ করা হয়েছে।</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">কল অপেক্ষা করুন</h3>
                  <p className="text-gray-600">আমাদের প্রতিনিধি শীঘ্রই আপনার ফোনে কল করে অর্ডারটি কনফার্ম করবে।</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => window.open(`https://wa.me/8801956869107?text=Hello%20Leather%20Wallah,%20আমার%20অর্ডার%20নম্বর%20${orderNumber}`)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp এ মেসেজ দিন
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/shop" className="btn-primary py-3 text-center">আরো শপিং করুন</Link>
            <Link to="/tracking" className="btn-secondary py-3 text-center">অর্ডার ট্র্যাক করুন</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderSubmitted) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">আপনার কার্ট খালি</h1>
        <Link to="/shop" className="btn-primary">শপিং চালিয়ে যান</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">চেকআউট</h1>
        <p className="text-gray-600">দয়া করে আপনার তথ্য দিন</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b">গ্রাহকের তথ্য</h2>
            {/* Delivery Area Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">ডেলিভারি এরিয়া নির্বাচন করুন</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="deliveryArea"
                    value="dhaka"
                    checked={deliveryArea === 'dhaka'}
                    onChange={handleDeliveryAreaChange}
                  />
                  <span>ঢাকার ভিতরে (৳৭০ ডেলিভারি চার্জ)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="deliveryArea"
                    value="outsideDhaka"
                    checked={deliveryArea === 'outsideDhaka'}
                    onChange={handleDeliveryAreaChange}
                  />
                  <span>ঢাকার বাহিরে (৳১৩০ ডেলিভারি চার্জ)</span>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Home className="w-4 h-4 mr-2" /> নাম *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                  placeholder="আপনার পুরো নাম"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2" /> ফোন নম্বর *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                  placeholder="01XXXXXXXXX"
                  pattern="[0-9]{11}"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">সাইজ (যদি জানা থাকে)</label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="যেমন: 42, M, L ইত্যাদি"
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" /> ডেলিভারি ঠিকানা
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">জেলা *</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                      placeholder="আপনার জেলা লিখুন"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">থানা/উপজেলা *</label>
                    <input
                      type="text"
                      name="thana"
                      value={formData.thana}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                      placeholder="আপনার থানা/উপজেলা লিখুন"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">বিস্তারিত ঠিকানা *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                    placeholder="হাউস নম্বর, রোড নম্বর, এলাকা"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">নোটস (ঐচ্ছিক)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="যেকোনো বিশেষ নির্দেশনা"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" /> পেমেন্ট মেথড
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Truck className="w-6 h-6 text-yellow-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Cash on Delivery (COD)</h4>
                    <p className="text-yellow-700 text-sm">পণ্য হাতে পেয়ে টাকা দিবেন। কোন advance payment এর দরকার নেই।</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t">
              <Link to="/cart" className="text-accent hover:underline flex items-center">
                <ArrowLeft className="w-5 h-5 mr-2" /> কার্টে ফিরে যান
              </Link>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`btn-primary px-8 py-3 text-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'অর্ডার হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">অর্ডার সামারি</h2>
            <div className="mb-6">
              <h3 className="font-semibold mb-4">পণ্যসমূহ ({cartItems.length})</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                        <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-semibold">৳{(item.price * item.quantity).toLocaleString('bn-BD')}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">সাবটোটাল</span>
                <span className="font-semibold">৳{subtotal.toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ডেলিভারি চার্জ</span>
                <span className="font-semibold">{shipping > 0 ? `৳${shipping}` : '৳০'}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>মোট</span>
                  <span className="text-accent">৳{total.toLocaleString('bn-BD')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="w-5 h-5 text-green-500 mr-2" />
                <span>১০০% সুরক্ষিত চেকআউট</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="w-5 h-5 text-accent mr-2" />
                <span>৩-৫ কর্মদিবসে ডেলিভারি</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}