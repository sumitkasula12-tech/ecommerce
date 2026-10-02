import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, CreditCard, Heart, Instagram, Facebook, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Value Props Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-gray-800 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-white shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Free Express Shipping</h4>
              <p className="text-xs text-gray-400">On all qualifying orders over $75</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Guaranteed Quality</h4>
              <p className="text-xs text-gray-400">Hand-picked premium fabrics</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-white shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">30 Days Easy Return</h4>
              <p className="text-xs text-gray-400">Hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-white shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Cash on Delivery Available</h4>
              <p className="text-xs text-gray-400">Pay safely upon receipt</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-gray-800">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white text-black rounded-xl flex items-center justify-center font-extrabold text-lg">
                U
              </div>
              <span className="font-black text-xl text-white tracking-tight">UrbanThread</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Scollection's UrbanThread is your modern destination for effortless, sustainable, and high-quality clothing essentials designed to fit your everyday lifestyle.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Shop Categories</h5>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/explore?category=Men" className="hover:text-white transition-colors">Men's Collection</Link></li>
              <li><Link to="/explore?category=Women" className="hover:text-white transition-colors">Women's Fashion</Link></li>
              <li><Link to="/explore?category=Outerwear" className="hover:text-white transition-colors">Jackets & Outerwear</Link></li>
              <li><Link to="/explore?category=Activewear" className="hover:text-white transition-colors">Activewear</Link></li>
              <li><Link to="/explore?category=Accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/account" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Order Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs & Support</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Newsletter</h5>
            <p className="text-xs text-gray-400 mb-3">Subscribe to receive 10% off your first order!</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-2 pl-3 pr-8 text-xs focus:outline-none focus:border-white"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute right-2.5 top-2.5" />
              </div>
              <button
                type="submit"
                className="w-full bg-white hover:bg-gray-100 text-black font-bold py-2 rounded-lg text-xs transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} UrbanThread by Scollection. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Payment Options:</span>
            <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-[10px] font-bold">Cash on Delivery</span>
            <span className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-[10px]">Cards (Coming Soon)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
