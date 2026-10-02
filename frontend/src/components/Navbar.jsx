import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sparkles,
  LogOut,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      {/* Top Banner */}
      <div className="bg-gray-900 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Scollection Autumn Special: Enjoy Free Shipping on orders over $75!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md group-hover:bg-brand-600 transition-colors">
              U
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-brand-600 transition-colors">
                UrbanThread
              </span>
              <span className="text-[10px] tracking-widest font-bold uppercase text-gray-400 -mt-1">
                by Scollection
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <Link
              to="/"
              className={`transition-colors hover:text-black ${
                isActive('/') ? 'text-black border-b-2 border-black pb-1' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`transition-colors hover:text-black ${
                isActive('/explore') ? 'text-black border-b-2 border-black pb-1' : 'text-gray-600'
              }`}
            >
              Explore
            </Link>
            <Link
              to="/explore?category=All"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Categories
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative w-64 xl:w-80">
            <input
              type="text"
              placeholder="Search fashion, tees, jackets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 hover:bg-gray-200/70 focus:bg-white border border-transparent focus:border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none transition-all placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="absolute right-3 text-gray-500 hover:text-black transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Action Badges & Auth */}
          <div className="flex items-center gap-5">
            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-700 hover:text-rose-600 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-black transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-black focus:outline-none py-1.5 px-3 rounded-full hover:bg-gray-100 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Profile Popup Menu */}
                {isProfileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setIsProfileOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/account"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span>My Account & Orders</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      <Heart className="w-4 h-4 text-gray-500" />
                      <span>My Wishlist ({wishlistCount})</span>
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full transition-all shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-black"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-500">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <nav className="flex flex-col space-y-3 font-semibold text-gray-700">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-black py-1 border-b border-gray-50"
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-black py-1 border-b border-gray-50"
            >
              Explore Clothing
            </Link>
            <Link
              to="/explore?category=All"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-black py-1 border-b border-gray-50"
            >
              Categories
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-black py-1 border-b border-gray-50 flex items-center justify-between"
            >
              <span>Wishlist</span>
              <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full">{wishlistCount}</span>
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-black py-1 border-b border-gray-50 flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
            </Link>
            {isAuthenticated ? (
              <Link
                to="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-black py-1 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>My Account</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-black py-1 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Login / Register</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
