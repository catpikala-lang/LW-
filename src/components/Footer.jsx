import { Facebook, Instagram, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">ChelseaBoots</h3>
            <p className="text-gray-300">
              Premium quality Chelsea boots for the modern gentleman. 
              Handcrafted with attention to detail.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-accent transition">Shop All</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition">Size Guide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition">Shipping Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition">Return Policy</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent" />
                <span className="text-gray-300">+880 1234 567890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="text-gray-300">support@chelseaboots.com</span>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-accent transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-accent transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} ChelseaBoots. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}