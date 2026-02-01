import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { totalItems } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Active link চেক করার ফাংশন
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Cart', path: '/cart' },
    { name: 'My Orders', path: '/order-history' }, // My Orders link fixed
    // { name: 'Tracking', path: '/tracking' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
              <span className="text-white font-bold text-lg">LW</span>
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="text-xl md:text-2xl font-black text-primary block">Leather</span>
              <span className="text-lg md:text-xl font-bold text-accent -mt-1 block">Wallah</span>
            </div>
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className={`text-sm lg:text-base font-semibold transition-all duration-300 hover:text-accent relative py-1 ${
                  isActive(link.path) ? 'text-accent border-b-2 border-accent' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Icons Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Tracking Quick Icon removed */}

            <button
              className="p-2 hover:bg-gray-100 rounded-full group transition-colors"
              onClick={() => navigate('/order-history')}
              title="Go to My Orders"
            >
              <User className="w-6 h-6 text-gray-700 group-hover:text-accent" />
            </button>
            
            {/* Updated Cart Icon with Counter */}
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full relative group transition-colors">
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-accent transition" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6 text-primary" />
            </button>
          </div>
        </div>

        {/* Mobile Menu (Animated) */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white absolute left-0 right-0 shadow-xl px-4 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-bold py-2 px-4 rounded-lg transition-colors ${
                  isActive(link.path) ? 'bg-accent/10 text-accent' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}