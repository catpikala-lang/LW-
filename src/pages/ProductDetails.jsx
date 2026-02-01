import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingBag, Truck, Shield, 
  Star, Ruler
} from 'lucide-react';
import { productDetails } from '../firebase/demoData';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FBEvents } from '../utils/facebookPixel';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProductFromFirebase = async (id) => {
      try {
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() });
        } else {
          setProduct(productDetails[id] || productDetails['1']);
        }
      } catch (error) {
        setProduct(productDetails[id] || productDetails['1']);
      }
    };
    loadProductFromFirebase(id);
  }, [id]);

  useEffect(() => {
    if (product) {
      FBEvents.viewContent(product.name, [product.id]);
    }
  }, [product]);

  // Add to Cart Function
  const handleAddToCart = () => {
    // সাইজ সিলেক্ট করা না থাকলে এরর দেখাবে
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.error('দয়া করে সাইজ নির্বাচন করুন');
      return;
    }
    
    addToCart(product, quantity, selectedSize, selectedColor);
    FBEvents.addToCart(
      product.price,
      'BDT',
      product.name,
      [product.id]
    );
    toast.success(
      <span>
        <span>{product.name} কার্টে যোগ হয়েছে!</span>
        <button
          onClick={() => navigate('/cart')}
          style={{ marginLeft: 12, color: '#0ea5e9', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
        >
          কার্ট দেখুন
        </button>
      </span>,
      { duration: 4000 }
    );
  };

  // Buy Now Function
  const handleBuyNow = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate('/cart');
  };

  if (!product) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Product Not Found</h1>
        <Link to="/shop" className="btn-primary inline-flex items-center text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 rounded-xl transition-transform active:scale-95">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      {/* Breadcrumb */}
      <div className="mb-4 sm:mb-6">
        <nav className="text-xs sm:text-sm text-gray-600">
          <Link to="/" className="hover:text-accent">Home</Link>
          <span className="mx-1 sm:mx-2">/</span>
          <Link to="/shop" className="hover:text-accent">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.category}</span>
          <span className="mx-2">/</span>
          <span className="text-primary font-semibold">{product.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-12">
        {/* Left Column - Images */}
        <div>
          <div className="bg-gray-100 rounded-2xl overflow-hidden mb-2 sm:mb-4 relative group">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex space-x-4 overflow-x-auto py-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                  selectedImage === index ? 'border-accent' : 'border-transparent bg-gray-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Info */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="text-3xl font-bold text-accent">
              ৳{product.price.toLocaleString('bn-BD')}
            </div>
            <div className="flex items-center text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
              <span className="ml-1 text-gray-700 font-medium">{product.rating}</span>
              <span className="ml-2 text-gray-500">({product.reviews} reviews)</span>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed mb-8">
            {product.longDescription || product.description}
          </p>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Ruler className="w-5 h-5 mr-2" /> Select Size
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 border-2 rounded-lg transition font-medium ${
                      selectedSize === size ? 'border-accent bg-accent/5 text-accent' : 'border-gray-200 hover:border-accent/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-8">
             <h3 className="text-lg font-semibold mb-3">Quantity</h3>
             <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-4 py-2 hover:bg-gray-100 transition">-</button>
                  <span className="px-6 py-2 border-x-2 border-gray-200 font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="px-4 py-2 hover:bg-gray-100 transition">+</button>
                </div>
                <div className="text-gray-600 font-medium">
                  Total: <span className="text-accent text-xl font-bold">৳{(product.price * quantity).toLocaleString('bn-BD')}</span>
                </div>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center hover:bg-opacity-90 transition shadow-lg active:scale-95"
            >
              <ShoppingBag className="w-6 h-6 mr-2" /> Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 border-2 border-primary text-primary py-4 rounded-xl font-bold hover:bg-primary hover:text-white transition active:scale-95"
            >
              Buy Now
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-accent/10 p-2 rounded-full">
                <Truck className="text-accent w-5 h-5" />
              </div>
              <span className="text-sm font-semibold">Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-accent/10 p-2 rounded-full">
                <Shield className="text-accent w-5 h-5" />
              </div>
              <span className="text-sm font-semibold">1 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}