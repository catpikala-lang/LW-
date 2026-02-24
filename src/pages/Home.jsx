import { ArrowRight, Shield, Truck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { demoProducts } from '../firebase/demoData';
import BannerSlider from '../components/BannerSlider';
import { getBannerImages } from '../firebase/firestoreFunctions';
import { useEffect, useState } from 'react';

export default function Home() {
  const { products, featuredProducts, loading } = useProducts();
  let displayFeatured = featuredProducts.filter(product => product.featured === true).slice(0, 4);
  if (displayFeatured.length === 0) {
    displayFeatured = products.length > 0 
      ? products.slice(0, 3)
      : demoProducts.filter(p => p.featured).slice(0, 3);
  }

  // Banner images
  const [bannerImages, setBannerImages] = useState([]);
  useEffect(() => {
    getBannerImages().then(setBannerImages);
  }, []);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      {/* Hero Section with BannerSlider */}
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col md:flex-row items-center md:justify-end gap-8">
          <div className="w-full md:w-1/2">
            <BannerSlider images={bannerImages} />
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-end justify-center text-center md:text-right px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-accent mb-3" style={{letterSpacing: '1px'}}>Leather <span className="text-primary">Wallah</span></h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-4" style={{maxWidth: '420px'}}>
              স্বাগতম! আমরা ১০০% খাঁটি গরুর চামড়ার প্রিমিয়াম পণ্য সারা দেশে পৌঁছে দিচ্ছি। মান, আস্থা ও স্টাইল—সব একসাথে।
            </p>
            <p className="text-sm sm:text-base text-gray-500 mb-6" style={{maxWidth: '420px'}}>
              এক্সক্লুসিভ কালেকশন, দ্রুত ডেলিভারি এবং সহজ রিটার্ন—সবকিছু এক জায়গায়।
            </p>
            <Link to="/shop">
              <button className="inline-flex items-center gap-2 bg-accent hover:bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow transition text-base sm:text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3.75l1.5 16.5A2.25 2.25 0 005.988 22.5h12.023a2.25 2.25 0 002.238-2.25l1.5-16.5M2.25 3.75h19.5M2.25 3.75l1.5 16.5M6.75 7.5v-1.5a2.25 2.25 0 012.25-2.25h6a2.25 2.25 0 012.25 2.25v1.5" />
                </svg>
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Why Leather Wallah?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-2 sm:mb-4">
              <Shield className="w-12 h-12 text-accent" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">1 Year Warranty</h3>
            <p className="text-gray-600 text-sm sm:text-base">Quality guaranteed with full warranty</p>
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-2 sm:mb-4">
              <Truck className="w-12 h-12 text-accent" />
            </div>
            {/* Free delivery text removed. No delivery text shown here. */}
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-2 sm:mb-4">
              <Clock className="w-12 h-12 text-accent" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Easy Returns</h3>
            <p className="text-gray-600 text-sm sm:text-base">7 days return policy</p>
          </div>
        </div>
      </div>
      
      {/* Featured Products Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Boots</h2>
          <Link to="/shop" className="text-accent hover:underline font-semibold">
            View All →
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(item => (
              <div key={item} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayFeatured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-accent to-yellow-500 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to Elevate Your Style?</h2>
        <p className="mb-6 opacity-90">Join 5000+ satisfied customers</p>
        <Link to="/shop" className="btn-secondary bg-white text-primary hover:bg-gray-100 text-lg">
          Shop Now
        </Link>
      </div>
    </div>
  );
}