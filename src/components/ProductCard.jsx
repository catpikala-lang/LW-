import { useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, ShoppingBag, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Safe image URL function - handles missing or broken images
const getSafeImageUrl = (product, hovered) => {
  const images = product.images || [];
  const thumbnails = product.thumbnails || [];
  let url;

  if (hovered && images[1]) {
    url = images[1];
  } else if (images[0]) {
    url = images[0];
  } else if (thumbnails[0]) {
    url = thumbnails[0];
  } else {
    return `https://placehold.co/600x400/1a202c/FFFFFF?text=${encodeURIComponent(product.name)}&font=inter`;
  }

  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    return url;
  }

  return `https://placehold.co/600x400/1a202c/FFFFFF?text=${encodeURIComponent(product.name)}&font=inter`;
};

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Add to Cart Function
  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error('পণ্যটি স্টকে নেই');
      return;
    }
    addToCart(product, 1);
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

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container with Hover Effect */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={getSafeImageUrl(product, hovered)}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://placehold.co/600x400/1a202c/FFFFFF?text=Image+Error&font=inter';
          }}
        />
        
        {/* Quick View Button */}
        <button className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Eye className="w-5 h-5" />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
            {product.name}
          </h3>
          <span className="text-accent font-bold">
            ৳{product.price.toLocaleString('bn-BD')}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Category & Rating */}
        <div className="flex justify-between items-center mb-4">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>

        {/* Available Sizes */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Available Sizes:</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes && product.sizes.map(size => (
              <span 
                key={size} 
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:border-accent hover:text-accent cursor-pointer transition"
              >
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link 
            to={`/product/${product.id}`}
            className="flex-1 btn-secondary text-center py-2"
          >
            View Details
          </Link>
          <button 
            onClick={handleAddToCart}
            className="flex items-center justify-center btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!product.inStock}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}