import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Navbar from './components/Navbar';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import AdminBannerManager from './pages/AdminBannerManager';
import Footer from './components/Footer';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdminOrderDetails from './pages/AdminOrderDetails';
import Contact from './pages/Contact';
import AdminProducts from './pages/AdminProducts';
import AdminProductsList from './pages/AdminProductsList';
// import Tracking from './pages/Tracking';
import WhatsAppButton from './components/WhatsAppButton';
import { useEffect } from 'react';
import { FBEvents } from './utils/facebookPixel';

function FBPixelRouteListener() {
  const location = useLocation();
  useEffect(() => {
    FBEvents?.pageView && FBEvents.pageView();
  }, [location]);
  return null;
}

function App() {
  return (
    <CartProvider>
      <Router>
        <FBPixelRouteListener />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/contact" element={<Contact />} />
              {/* <Route path="/tracking" element={<Tracking />} /> */}
              <Route path="/admin/orders/:orderId" element={<AdminOrderDetails />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products-list" element={<AdminProductsList />} />
              <Route path="/admin/banner-manager" element={<AdminBannerManager />} />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontSize: '1.1rem',
                borderRadius: '8px',
                padding: '14px 20px',
                maxWidth: '90vw',
                wordBreak: 'break-word',
              },
              duration: 3500,
            }}
          />
          <WhatsAppButton />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;